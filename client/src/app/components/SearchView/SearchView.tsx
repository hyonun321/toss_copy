'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchResults } from '@/app/components/searchResults/SearchResults';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import { BaseStock } from '@/app/types/stock';
import { fetchPopularStocks, searchStocks } from './stockApi';

export function SearchView() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BaseStock[]>([]);
  const [popularStocks, setPopularStocks] = useState<BaseStock[]>([]);
  const [loading, setLoading] = useState(true);

  // 인기 주식 데이터 가져오기
  useEffect(() => {
    const getPopularStocks = async () => {
      try {
        setLoading(true);
        const stocks = await fetchPopularStocks();

        // API 응답을 BaseStock 형태로 변환
        const formattedStocks: BaseStock[] = stocks.map((stock: any) => ({
          id: stock.code,
          symbol: stock.code,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: parseFloat(stock.changeRate),
          isPositive: stock.positiveChange,
          rank: stock.rank,
          logoType: 'normal', // 기본값, 필요에 따라 조정
          country: 'kr',
        }));

        setPopularStocks(formattedStocks);
      } catch (error) {
        console.error('인기 주식 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    getPopularStocks();
  }, []);

  // 디바운싱을 위한 상태
  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (currentQuery.trim().length > 0) {
        try {
          const results = await searchStocks(currentQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('검색 중 오류 발생:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [currentQuery]);

  const handleSearch = async (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev]);
    }

    try {
      // 검색 실행 및 결과 설정
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  const handleStockSelect = (stock: BaseStock) => {
    console.log('선택한 주식:', stock);
  };

  // 태그(검색 히스토리) 클릭 처리
  const handleTagClick = (tag: string) => {
    console.log('선택한 태그:', tag);

    // 현재 쿼리 상태 업데이트
    setCurrentQuery(tag);

    // 이미 히스토리에 있는 항목이므로 별도 추가는 불필요
  };

  // 태그 삭제 처리
  const handleTagRemove = (tag: string) => {
    setSearchHistory((prev) => prev.filter((item) => item !== tag));
  };

  return (
    <SearchViewContainer>
      <SearchContent>
        <SearchBar
          onSearch={handleSearch}
          placeholder="LG유플러스를 검색하세요"
          onQueryChange={handleQueryChange}
          value={currentQuery}
        />

        {currentQuery.trim() ? (
          <SearchResults
            results={searchResults}
            searchQuery={currentQuery}
            onStockSelect={handleStockSelect}
          />
        ) : (
          <>
            <SearchTags
              initialTags={searchHistory} // 실제 검색 히스토리 사용
              onTagClick={handleTagClick} // 태그 클릭 이벤트 핸들러 추가
              onTagRemove={handleTagRemove} // 태그 삭제 이벤트 핸들러 추가
            />
            <PopularStocks
              stocks={popularStocks}
              loading={loading}
              onStockClick={handleStockSelect}
            />
          </>
        )}
      </SearchContent>
    </SearchViewContainer>
  );
}
