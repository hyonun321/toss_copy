'use client';

import { useState } from 'react';
import { MarketHeader } from '@/app/components/MarketHeader/MarketHeader';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { StockListItem } from '@/app/components/StockListItem/StockListItem';
import { BottomNavigation } from '@/app/components/BottomNavigation/BottomNavigation';
import { useStockData } from '@/app/hooks/useStockData';
import {
  PageContainer,
  SectionTitle,
  StockListContainer,
  LoadingIndicator,
  ErrorMessage,
} from './HomeView.style';

// Fallback data for when the API is loading or encounters an error
const fallbackStockData = [
  {
    rank: 1,
    stockCode: 'TSLL',
    stockName: 'TSLL',
    price: '11,589원',
    change: '+7.7%',
    changePercentage: '+7.7%',
    isPositiveChange: true,
    isFavorite: false,
  },
  {
    rank: 2,
    stockCode: 'TSLA',
    stockName: '테슬라',
    price: '337,024원',
    change: '+4.6%',
    changePercentage: '+4.6%',
    isPositiveChange: true,
    isFavorite: true,
  },
  {
    rank: 3,
    stockCode: 'TSLQ',
    stockName: 'TSLQ',
    price: '93,546원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: true,
  },
  {
    rank: 4,
    stockCode: 'SPY',
    stockName: 'S&P 500',
    price: '55,116원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: false,
  },
  {
    rank: 5,
    stockCode: 'NVDL',
    stockName: 'NVDL',
    price: '35,526원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: true,
  },
];

export function HomeView() {
  // Initialize with trade-value (거래대금) as the default tab
  const [stockType, setStockType] = useState('domestic/trade-value');
  const { stocks, loading, error } = useStockData(stockType);

  const handleTabChange = (tabType) => {
    console.log('Tab changed to:', tabType);
    setStockType(tabType);
  };

  // Use real data if available, fallback data otherwise
  const stockListData =
    loading || error || !stocks.length ? fallbackStockData : stocks;

  return (
    <PageContainer>
      <MarketHeader />
      <ImageText
        imageSrc="/images/egg.png"
        text={
          <>
            반가워요 test 님!
            <br />
            오늘의 실시간 차트를 확인하세요
          </>
        }
      />
      <SectionTitle>실시간 차트</SectionTitle>

      {/* 탭 변경 이벤트 처리 */}
      <CategoryTabs onTabChange={handleTabChange} activeTab={stockType} />

      {/* 로딩 상태 표시 */}
      {loading && (
        <LoadingIndicator>데이터를 불러오는 중입니다...</LoadingIndicator>
      )}

      {/* 오류 상태 표시 */}
      {error && (
        <ErrorMessage>
          데이터를 불러오는 중 오류가 발생했습니다: {error}
        </ErrorMessage>
      )}

      <StockListContainer>
        {stockListData.map((stock) => (
          <StockListItem
            key={`${stock.rank}-${stock.stockCode}`}
            rank={stock.rank}
            stockCode={stock.stockCode}
            stockName={stock.stockName}
            price={stock.price}
            change={stock.change}
            changePercentage={stock.changePercentage}
            isPositiveChange={stock.isPositiveChange}
            isFavorite={stock.isFavorite}
          />
        ))}
      </StockListContainer>
      <BottomNavigation />
    </PageContainer>
  );
}
