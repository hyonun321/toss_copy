'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchResults } from '@/app/components/searchResults/SearchResults';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import { dummyStocks } from '@/app/data/dummyStocks';
import { BaseStock } from '@/app/types/stock';
import { fetchPopularStocks } from './stockApi';

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
    const debounceTimeout = setTimeout(() => {
      if (currentQuery.trim().length > 0) {
        // 실제로는 여기서 API 호출을 할 수 있습니다
        const results = dummyStocks.filter(
          (stock) =>
            stock.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(currentQuery.toLowerCase()),
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(debounceTimeout);
  }, [currentQuery]);

  const handleSearch = (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev]);
    }
    console.log('검색어:', query);
    // 전체 검색 실행 (예: 다른 페이지로 이동)
  };

  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  const handleStockSelect = (stock: BaseStock) => {
    console.log('선택한 주식:', stock);
    const searchTerm = stock.name;

    // 현재 쿼리 상태 업데이트 - 이것이 검색 결과와 SearchBar 표시에 영향
    setCurrentQuery(searchTerm);

    // 검색 히스토리에 추가
    if (!searchHistory.includes(searchTerm)) {
      setSearchHistory((prev) => [searchTerm, ...prev]);
    }
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
            <SearchTags />
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
