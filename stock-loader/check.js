// check.js 파일을 수정하세요
const { Client } = require('@elastic/elasticsearch');

async function checkData() {
  const client = new Client({ node: 'http://localhost:9200' });
  
  // 총 문서 수 확인
  const countResponse = await client.count({ index: 'stock_symbols' });
  console.log(`총 주식 개수: ${countResponse.count}`);
  
  // 문제가 된 집계 쿼리 수정
  try {
    // 먼저 market.keyword로 시도
    const aggResponse = await client.search({
      index: 'stock_symbols',
      size: 0,
      aggs: {
        markets: {
          terms: {
            field: 'market.keyword' // .keyword 서브필드 사용
          }
        }
      }
    });
    
    console.log('\n거래소별 주식 수:');
    const buckets = aggResponse.aggregations.markets.buckets;
    buckets.forEach(bucket => {
      console.log(`${bucket.key}: ${bucket.doc_count}개`);
    });
  } catch (error) {
    console.log('\n거래소별 집계에 실패했습니다. 매핑 확인이 필요합니다.');
    console.log('대신 몇 가지 고유한 거래소 값을 표시합니다:');
    
    // 대안: 샘플 데이터에서 거래소 값 확인
    const sampleResponse = await client.search({
      index: 'stock_symbols',
      size: 100
    });
    
    const markets = new Set();
    sampleResponse.hits.hits.forEach(hit => {
      if (hit._source.market) {
        markets.add(hit._source.market);
      }
    });
    
    console.log('발견된 거래소:', Array.from(markets));
  }
  
  // 몇 가지 샘플 데이터 확인
  const sampleResponse = await client.search({
    index: 'stock_symbols',
    size: 100
  });
  
  console.log('\n샘플 데이터:');
  sampleResponse.hits.hits.forEach(hit => {
    console.log(hit._source);
  });
  
  // 특정 주식 검색 테스트
  const searchResponse = await client.search({
    index: 'stock_symbols',
    query: {
      match: {
        name: '애플'
      }
    }
  });
  
  console.log('\n"애플" 검색 결과:');
  if (searchResponse.hits.hits.length > 0) {
    searchResponse.hits.hits.forEach(hit => {
      console.log(`${hit._source.symbol} - ${hit._source.name} (${hit._source.market})`);
    });
  } else {
    console.log('결과가 없습니다. 다른 검색어를 시도해보세요.');
  }
}

checkData().catch(console.error);