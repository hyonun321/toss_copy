'use client';
import { useState } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import { PopularStockItem } from '@/app/types';

export function SearchView() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev]);
    }
    console.log('검색어:', query);
  };

  const handleStockClick = (stock: PopularStockItem) => {
    console.log('선택한 주식:', stock);
  };

  return (
    <SearchViewContainer>
      <SearchContent>
        <SearchBar
          onSearch={handleSearch}
          placeholder="LG유플러스를 검색하세요"
        />
        <SearchTags />
        <PopularStocks onStockClick={handleStockClick} />
      </SearchContent>
    </SearchViewContainer>
  );
}
