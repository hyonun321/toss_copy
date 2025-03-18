'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchResults } from '@/app/components/searchResults/SearchResults';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import { dummyStocks } from '@/app/data/dummyStocks';
import { BaseStock } from '@/app/types/stock';

export function SearchView() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BaseStock[]>([]);

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
    // 주식 상세 페이지로 이동하는 로직
  };

  return (
    <SearchViewContainer>
      <SearchContent>
        <SearchBar
          onSearch={handleSearch}
          placeholder="LG유플러스를 검색하세요"
          onQueryChange={handleQueryChange}
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
              stocks={dummyStocks.filter(
                (stock) => stock.rank && stock.rank <= 5,
              )}
              onStockClick={handleStockSelect}
            />
          </>
        )}
      </SearchContent>
    </SearchViewContainer>
  );
}
