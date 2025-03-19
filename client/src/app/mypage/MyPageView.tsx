'use client';

import { useState, useEffect } from 'react';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { StockListItem } from '@/app/components/StockListItem/StockListItem';
import { BottomNavigation } from '@/app/components/BottomNavigation/BottomNavigation';
import { ALL_ENDPOINTS, Endpoint } from '@/app/constants/tabMappings';
import { ApiResponse, TransformedStockItem } from '@/app/types';
import {
  PageContainer,
  StockListContainer,
  LoadingIndicator,
  ErrorMessage,
} from './MyPageView.style';

import {
  formatPrice,
  formatChange,
  formatPercentage,
} from '@/app/utils/formatters';
import Image from 'next/image';

export function MyPageView() {
  const [activeTab, setActiveTab] = useState<Endpoint>('all');
  const [favoriteStocks, setFavoriteStocks] = useState<TransformedStockItem[]>(
    [],
  );
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());

  const refreshData = () => {
    setLastRefreshed(Date.now());
  };

  useEffect(() => {
    async function fetchFavoriteStocks() {
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

        let allFavoriteStocks: TransformedStockItem[] = [];

        results.forEach(({ category, data }) => {
          if (data.resultCode === '0' && Array.isArray(data.stocks)) {
            const transformedData: TransformedStockItem[] = data.stocks.map(
              (item, index) => ({
                category: category,
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
                isFavorite: true,
              }),
            );

            const randomFavorites = transformedData.slice(
              0,
              Math.floor(Math.random() * 3) + 2,
            );

            allFavoriteStocks = [...allFavoriteStocks, ...randomFavorites];
          }
        });

        allFavoriteStocks = allFavoriteStocks.map((stock, index) => ({
          ...stock,
          rank: index + 1,
        }));

        setFavoriteStocks(allFavoriteStocks);
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

    fetchFavoriteStocks();
  }, [lastRefreshed]);

  const handleTabChange = (tabType: Endpoint) => {
    setActiveTab(tabType);
    refreshData();
  };

  const filteredStocks = favoriteStocks.filter((stock) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'foreign') {
      return ['TSLA', 'NVDL', 'S&P 500'].some(
        (prefix) =>
          stock.stockCode.includes(prefix) || stock.stockName.includes(prefix),
      );
    }
    if (activeTab === 'domestic') {
      return !['TSLA', 'NVDL', 'S&P 500'].some(
        (prefix) =>
          stock.stockCode.includes(prefix) || stock.stockName.includes(prefix),
      );
    }
    return true;
  });

  return (
    <PageContainer>
      <div style={{ padding: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        내 종목 보기
      </div>

      <CategoryTabs
        onTabChange={handleTabChange}
        activeTab={activeTab}
        customTabs={[
          { id: 'all', label: '전체' },
          { id: 'foreign', label: '해외주식' },
          { id: 'domestic', label: '국내주식' },
        ]}
      />

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
        {filteredStocks.map((stock) => (
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
      <BottomNavigation state="mypage" />
    </PageContainer>
  );
}
