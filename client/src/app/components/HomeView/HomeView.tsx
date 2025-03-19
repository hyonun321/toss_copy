'use client';

import { useState, useEffect } from 'react';
import { MarketHeader } from '@/app/components/MarketHeader/MarketHeader';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { StockListItem } from '@/app/components/StockListItem/StockListItem';
import { BottomNavigation } from '@/app/components/BottomNavigation/BottomNavigation';
import { ALL_ENDPOINTS, Endpoint } from '@/app/constants/tabMappings';
import {
  CategoryDataType,
  ApiResponse,
  TransformedStockItem,
} from '@/app/types';
import {
  PageContainer,
  SectionTitle,
  StockListContainer,
  LoadingIndicator,
  ErrorMessage,
} from './HomeView.style';

import {
  formatPrice,
  formatChange,
  formatPercentage,
} from '@/app/utils/formatters';
import Image from 'next/image';

export function HomeView() {
  const [activeTab, setActiveTab] = useState<Endpoint>('domestic/trade-value');
  const [categoryData, setCategoryData] = useState<CategoryDataType>(
    ALL_ENDPOINTS.reduce(
      (acc, endpoint) => ({
        ...acc,
        [endpoint]: [],
      }),
      {} as CategoryDataType,
    ),
  );
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());
  const nickname =
    typeof window !== 'undefined' ? sessionStorage.getItem('nickname') : null;
  const refreshData = () => {
    setLastRefreshed(Date.now());
  };

  useEffect(() => {
    async function fetchAllCategoryData() {
      setInitialLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          ALL_ENDPOINTS.map(async (category) => {
            const response = await fetch(
              `http://localhost:8080/api/stocks/${category}`,
            );

            if (!response.ok) {
              throw new Error(`${category} 데이터를 가져오는 중 오류 발생`);
            }

            const data: ApiResponse = await response.json();
            return { category, data };
          }),
        );

        const newCategoryData: CategoryDataType = ALL_ENDPOINTS.reduce(
          (acc, endpoint) => ({
            ...acc,
            [endpoint]: [],
          }),
          {} as CategoryDataType,
        );
        results.forEach(({ category, data }) => {
          if (data.resultCode === '0' && Array.isArray(data.stocks)) {
            const transformedData: TransformedStockItem[] = data.stocks.map(
              (item, index) => ({
                rank: index + 1,
                stockCode: item.code,
                stockName: item.name,
                price: formatPrice(item.price.toString()),
                change: formatChange(item.change),
                changePercentage: formatPercentage(item.changeRate.toString()),
                isPositiveChange:
                  item.isPositiveChange !== undefined
                    ? item.isPositiveChange
                    : !item.change.startsWith('-'),
                isFavorite: false,
              }),
            );

            newCategoryData[category as Endpoint] = transformedData;
          }
        });

        setCategoryData(newCategoryData);
      } catch (err) {
        console.error('데이터 로딩 중 오류 발생:', err);
        setError(
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
        );
      } finally {
        setInitialLoading(false);
      }
    }

    fetchAllCategoryData();
  }, [lastRefreshed]);

  const handleTabChange = (tabType: Endpoint) => {
    setActiveTab(tabType);
  };

  const currentTabData = categoryData[activeTab] || [];
  const stockListData =
    initialLoading || error || !currentTabData.length ? [] : currentTabData;

  return (
    <PageContainer>
      <MarketHeader onRefresh={refreshData} />
      <ImageText
        imageSrc="/images/egg.png"
        text={
          <>
            반가워요 {nickname}님!
            <br />
            오늘의 실시간 차트를 확인하세요
          </>
        }
      />
      <SectionTitle>실시간 차트</SectionTitle>

      <CategoryTabs onTabChange={handleTabChange} activeTab={activeTab} />

      {initialLoading && (
        <LoadingIndicator>
          <Image
            unoptimized={true}
            src="/images/loading.gif"
            alt="데이터를 불러오는 중입니다..."
            width={50}
            height={50}
          />
        </LoadingIndicator>
      )}

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
      <BottomNavigation state="home" />
    </PageContainer>
  );
}
