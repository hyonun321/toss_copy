'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar/SearchBar';
import { SearchTags } from '@/app/components/SearchTags/SearchTags';
import { PopularStocks } from '@/app/components/PopularStocks/PopularStocks';
import { SearchResults } from '@/app/components/SearchResults/SearchResults';
import { SearchViewContainer, SearchContent } from './SearchView.style';
import BottomSheet from '@/app/components/BottomSheet/BottomSheet';
import BottomSheetContent from '@/app/components/BottomSheet/BottomSheetContent';
import { BaseStock } from '@/app/types/stock';
import {
  deleteSearchQuery,
  getSearchHistory,
  saveSearchQuery,
  fetchPopularStocks,
  searchStocks,
} from './stockApi';
import { StockApiResponse } from '@/app/types/stock';
import { SkeletonSearchTags } from '../../../components/SkeletonSearchTags/SkeletonSearchTags';
import { useAuthStore } from '@/app/stores/authStore';
export function SearchView() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BaseStock[]>([]);
  const [popularStocks, setPopularStocks] = useState<BaseStock[]>([]);
  const [loading, setLoading] = useState(true);
  const { email } = useAuthStore();
  const [selectedStock, setSelectedStock] = useState<BaseStock | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
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
        const history = await getSearchHistory(email);
        setSearchHistory(history);
      } catch (error) {
        console.error('검색 기록 조회 실패:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchSearchHistory();
  }, [email]);

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
      saveSearchQuery(email, query);
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  // 주식 선택 처리 함수 수정
  const handleStockSelect = async (stock: BaseStock) => {
    console.log('선택한 주식:', stock);
    setSelectedStock(stock);

    // 선택한 주식이 찜 목록에 있는지 확인
    if (email) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/likes/isLiked?email=${email}&stockCode=${stock.symbol}`,
        );

        if (response.ok) {
          const isLiked = await response.json();
          setIsFavorite(isLiked);
        }
      } catch (error) {
        console.error('좋아요 상태 확인 실패:', error);
        setIsFavorite(false);
      }
    }

    // 바텀시트 열기
    setIsBottomSheetOpen(true);
  };

  // 찜하기 처리 함수
  const handleFavoriteConfirm = async () => {
    if (!email || !selectedStock) return;

    try {
      const url = isFavorite
        ? 'http://localhost:8080/api/likes/remove'
        : 'http://localhost:8080/api/likes/add';
      let exchangeCode = 'KRX';
      if (selectedStock.symbol.match(/[A-Z]/)) {
        exchangeCode = 'NAS'; // 기본 해외거래소는 나스닥으로 가정
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          stockCode: selectedStock.symbol,
          stockName: selectedStock.name,
          exchangeCode: exchangeCode,
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        // 성공 메시지나 피드백 표시 가능
      } else {
        console.error('찜하기 변경 실패');
      }
    } catch (error) {
      console.error('찜하기 변경 중 오류 발생:', error);
    } finally {
      setIsBottomSheetOpen(false);
    }
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
      await deleteSearchQuery(email, tag);
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
              <SkeletonSearchTags />
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

      {/* 바텀시트 모달 추가 */}
      {isBottomSheetOpen && selectedStock && (
        <BottomSheet height="20vh">
          <BottomSheetContent
            title={
              <>
                {selectedStock.name}을(를)
                <br />
                {isFavorite
                  ? '관심종목에서 삭제하시겠습니까?'
                  : '관심종목에 등록하시겠습니까?'}
              </>
            }
            leftIcon="/images/cancel.png"
            leftButtonText="취소"
            rightButtonText={isFavorite ? '삭제' : '등록'}
            onClose={() => setIsBottomSheetOpen(false)}
            onLeftClick={() => setIsBottomSheetOpen(false)}
            onRightClick={handleFavoriteConfirm}
          />
        </BottomSheet>
      )}
    </SearchViewContainer>
  );
}
