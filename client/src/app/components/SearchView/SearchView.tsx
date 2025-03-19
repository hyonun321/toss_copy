'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchResults } from '@/app/components/SearchResults/SearchResults';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import { BaseStock } from '@/app/types/stock';
import {
  deleteSearchQuery,
  getSearchHistory,
  saveSearchQuery,
  fetchPopularStocks,
  searchStocks,
} from './stockApi';
import { StockApiResponse } from '@/app/types/stock';
import { SkeletonSearchTags } from '../SkeletonSearchTags/SkeletonSearchTags';

export function SearchView() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BaseStock[]>([]);
  const [popularStocks, setPopularStocks] = useState<BaseStock[]>([]);
  const [loading, setLoading] = useState(true);
  // 현재 로그인된 사용자 이메일 (예시)
  const userEmail = 'user@example.com'; // 실제로는 상태/컨텍스트에서 가져와야 함

  // 인기 주식 데이터 가져오기
  useEffect(() => {
    const getPopularStocks = async () => {
      try {
        setLoading(true);
        const stocks = await fetchPopularStocks();

        // API 응답을 BaseStock 형태로 변환
        const formattedStocks: BaseStock[] = stocks.map(
          (stock: StockApiResponse) => ({
            id: stock.code,
            symbol: stock.code,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changeRate,
            isPositive: stock.positiveChange,
            rank: stock.rank,
            logoType: 'normal', // 기본값, 필요에 따라 조정
            country: 'kr',
          }),
        );

        setPopularStocks(formattedStocks);
      } catch (error) {
        console.error('인기 주식 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    getPopularStocks();
  }, []);

  // 검색 기록 가져오기
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        setHistoryLoading(true);
        const history = await getSearchHistory(userEmail);
        setSearchHistory(history);
      } catch (error) {
        console.error('검색 기록 조회 실패:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchSearchHistory();
  }, [userEmail]);

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
      saveSearchQuery(userEmail, query);
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

  const handleTagRemove = async (tag: string) => {
    // 로컬 상태 업데이트
    setSearchHistory((prev) => prev.filter((item) => item !== tag));

    // 서버에서도 삭제
    try {
      await deleteSearchQuery(userEmail, tag);
    } catch (error) {
      console.error('검색어 삭제 실패:', error);
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
            {historyLoading ? (
              <SkeletonSearchTags /> // 스켈레톤 UI 컴포넌트 (구현 필요)
            ) : (
              <SearchTags
                initialTags={searchHistory}
                onTagClick={handleTagClick}
                onTagRemove={handleTagRemove}
              />
            )}
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
