// fix-loading.js 파일을 생성하세요
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const csv = require('csv-parser');

// Elasticsearch 클라이언트 생성
const client = new Client({ node: 'http://localhost:9200' });

// 인덱스 삭제 후 다시 생성
async function resetIndex() {
  try {
    const exists = await client.indices.exists({ index: 'stock_symbols' });
    if (exists) {
      await client.indices.delete({ index: 'stock_symbols' });
      console.log('기존 인덱스를 삭제했습니다.');
    }
    
    await client.indices.create({
      index: 'stock_symbols',
      body: {
        mappings: {
          properties: {
            symbol: { type: 'keyword' },
            name: { 
              type: 'text',
              fields: { keyword: { type: 'keyword' } }
            },
            market: { type: 'keyword' }
          }
        }
      }
    });
    
    console.log('새 인덱스를 생성했습니다.');
    return true;
  } catch (error) {
    console.error('인덱스 재설정 오류:', error);
    return false;
  }
}

// CSV 파일 분석하기
async function analyzeCSV() {
  return new Promise((resolve, reject) => {
    const headers = [];
    let firstRow = null;
    let rowCount = 0;
    
    fs.createReadStream('stocks.csv')
      .pipe(csv())
      .on('headers', (csvHeaders) => {
        headers.push(...csvHeaders);
        console.log('CSV 헤더:', headers);
      })
      .on('data', (row) => {
        rowCount++;
        if (!firstRow) {
          firstRow = row;
          console.log('첫 번째 행 데이터:', firstRow);
        }
      })
      .on('end', () => {
        console.log(`총 ${rowCount}개 행이 CSV 파일에 있습니다.`);
        resolve({ headers, firstRow, rowCount });
      })
      .on('error', reject);
  });
}

// 데이터 로딩
async function loadData(csvInfo) {
  const { headers, rowCount } = csvInfo;
  
  // 헤더에서 필드 이름 추출
  let symbolField = '종목코드';
  let nameField = '종목명';
  let marketField = '거래소';
  
  // 헤더가 다른 경우 매핑 시도
  if (!headers.includes(symbolField)) {
    // 가능한 대체 필드명 찾기 (종목코드, symbol, Symbol, code, Code 등)
    const possibleSymbolFields = headers.filter(h => 
      h.includes('종목코드') || h.includes('symbol') || h.includes('Symbol') || 
      h.includes('code') || h.includes('Code')
    );
    
    if (possibleSymbolFields.length > 0) {
      symbolField = possibleSymbolFields[0];
      console.log(`종목코드 필드를 '${symbolField}'로 추정합니다.`);
    } else {
      console.log('종목코드 필드를 찾을 수 없습니다. 첫 번째 열을 사용합니다.');
      symbolField = headers[0];
    }
  }
  
  if (!headers.includes(nameField)) {
    // 가능한 대체 필드명 찾기
    const possibleNameFields = headers.filter(h => 
      h.includes('종목명') || h.includes('name') || h.includes('Name') || 
      h.includes('종목 명') || h.includes('종목이름')
    );
    
    if (possibleNameFields.length > 0) {
      nameField = possibleNameFields[0];
      console.log(`종목명 필드를 '${nameField}'로 추정합니다.`);
    } else {
      console.log('종목명 필드를 찾을 수 없습니다. 두 번째 열을 사용합니다.');
      nameField = headers[1];
    }
  }
  
  if (!headers.includes(marketField)) {
    // 가능한 대체 필드명 찾기
    const possibleMarketFields = headers.filter(h => 
      h.includes('거래소') || h.includes('market') || h.includes('Market') || 
      h.includes('exchange') || h.includes('Exchange')
    );
    
    if (possibleMarketFields.length > 0) {
      marketField = possibleMarketFields[0];
      console.log(`거래소 필드를 '${marketField}'로 추정합니다.`);
    } else {
      console.log('거래소 필드를 찾을 수 없습니다. 세 번째 열을 사용합니다.');
      marketField = headers[2];
    }
  }
  
  console.log(`사용할 필드: 종목코드=${symbolField}, 종목명=${nameField}, 거래소=${marketField}`);
  
  // 데이터 로딩 시작
  return new Promise((resolve, reject) => {
    const stocks = [];
    
    fs.createReadStream('stocks.csv')
      .pipe(csv())
      .on('data', (row) => {
        // 필드 추출
        const stock = {
          symbol: row[symbolField],
          name: row[nameField],
          market: row[marketField]
        };
        
        // 값 검증
        if (!stock.symbol || !stock.name || !stock.market) {
          console.warn('불완전한 데이터가 있습니다:', row);
        } else {
          stocks.push(stock);
        }
        
        // 진행상황 표시
        if (stocks.length % 1000 === 0) {
          console.log(`${stocks.length}개 처리 중...`);
        }
      })
      .on('end', async () => {
        console.log(`${stocks.length}개 주식 데이터를 읽었습니다.`);
        
        // 벌크 로딩 시작
        const chunkSize = 1000;
        let successCount = 0;
        let errorCount = 0;
        
        try {
          for (let i = 0; i < stocks.length; i += chunkSize) {
            const chunk = stocks.slice(i, i + chunkSize);
            const operations = chunk.flatMap(stock => [
              { 
                index: { 
                  _index: 'stock_symbols', 
                  _id: `${stock.market}_${stock.symbol}` // ID 형식에 주의
                } 
              },
              { 
                symbol: stock.symbol,
                name: stock.name,
                market: stock.market
              }
            ]);
            
            try {
              const bulkResponse = await client.bulk({ 
                refresh: true,
                body: operations 
              });
              
              // 응답 처리
              if (bulkResponse.errors || 
                  (bulkResponse.body && bulkResponse.body.errors)) {
                
                // 오류 발생 항목 확인
                const items = bulkResponse.items || 
                             (bulkResponse.body && bulkResponse.body.items) || [];
                             
                let batchErrorCount = 0;
                items.forEach((action, idx) => {
                  const operation = Object.keys(action)[0];
                  if (action[operation].error) {
                    batchErrorCount++;
                    console.error(`오류 발생 항목 #${i + idx/2}:`, action[operation].error);
                  }
                });
                
                errorCount += batchErrorCount;
                successCount += (chunk.length - batchErrorCount);
              } else {
                successCount += chunk.length;
              }
              
              console.log(`${i+chunk.length}/${stocks.length} 처리 완료 (성공: ${successCount}, 실패: ${errorCount})`);
            } catch (error) {
              console.error(`벌크 작업 오류 (${i}-${i+chunk.length}):`, error);
              errorCount += chunk.length;
            }
          }
          
          console.log(`작업 완료: 총 ${successCount}개 성공, ${errorCount}개 실패`);
          resolve({ successCount, errorCount });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// 메인 함수
async function main() {
  try {
    // 1. CSV 파일 분석
    console.log('CSV 파일 분석 중...');
    const csvInfo = await analyzeCSV();
    
    // 2. 인덱스 재설정
    console.log('인덱스 재설정 중...');
    const resetSuccess = await resetIndex();
    if (!resetSuccess) {
      console.error('인덱스 재설정 실패. 프로그램을 종료합니다.');
      return;
    }
    
    // 3. 데이터 로딩
    console.log('데이터 로딩 시작...');
    const result = await loadData(csvInfo);
    
    // 4. 확인
    const countResponse = await client.count({ index: 'stock_symbols' });
    console.log(`최종 확인: 인덱스에 ${countResponse.count}개 문서가 있습니다.`);
    
  } catch (error) {
    console.error('프로그램 실행 오류:', error);
  }
}

main();