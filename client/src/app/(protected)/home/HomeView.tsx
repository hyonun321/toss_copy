'use client';

import { useState, useEffect } from 'react';
import { MarketHeader } from '@/app/components/MarketHeader/MarketHeader';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { StockListItem } from '@/app/components/StockListItem/StockListItem';
import { BottomNavigation } from '@/app/components/BottomNavigation/BottomNavigation';
import {
  MarketToggle,
  Market,
} from '@/app/components/MarketToggle/MarketToggle';
import { Endpoint } from '@/app/constants/tabMappings';
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
import { useAuthStore } from '@/app/stores/authStore';

// 국내 주식 엔드포인트
const DOMESTIC_ENDPOINTS: Endpoint[] = [
  'domestic/trade-value',
  'domestic/volume',
  'domestic/rising',
  'domestic/falling',
];

// 미국 주식 엔드포인트 (아직 API가 없는 경우 빈 배열로 시작)
const OVERSEAS_ENDPOINTS: Endpoint[] = [
  'overseas/trade-value',
  'overseas/volume',
  'overseas/rising',
  'overseas/falling',
];

export function HomeView() {
  // 현재 선택된 시장 (국내/미국)
  const [selectedMarket, setSelectedMarket] = useState<Market>('domestic');

  // 시장에 따른 활성 탭 (각 시장별로 별도 상태 관리)
  const [domesticActiveTab, setDomesticActiveTab] = useState<Endpoint>(
    'domestic/trade-value',
  );
  const [overseasActiveTab, setOverseasActiveTab] = useState<Endpoint>(
    'overseas/trade-value',
  );

  // 현재 활성 탭 (선택된 시장에 따라 결정)
  const activeTab =
    selectedMarket === 'domestic' ? domesticActiveTab : overseasActiveTab;

  const [categoryData, setCategoryData] = useState<CategoryDataType>(
    [...DOMESTIC_ENDPOINTS, ...OVERSEAS_ENDPOINTS].reduce(
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
  const { nickname } = useAuthStore();

  const refreshData = () => {
    setLastRefreshed(Date.now());
  };

  // 마운트 시 모든 데이터 로드
  useEffect(() => {
    async function fetchAllCategoryData() {
      setInitialLoading(true);
      setError(null);

      try {
        // 국내 주식과 미국 주식 데이터를 모두 로드
        const allEndpoints = [...DOMESTIC_ENDPOINTS, ...OVERSEAS_ENDPOINTS];

        const results = await Promise.all(
          allEndpoints.map(async (category) => {
            // API 요청이 구현된 엔드포인트만 호출
            try {
              const response = await fetch(
                `http://localhost:8080/api/stocks/${category}`,
              );

              if (!response.ok) {
                console.warn(
                  `${category} 데이터 로드 실패: ${response.status}`,
                );
                return {
                  category,
                  data: { resultCode: '1', message: '데이터 없음', stocks: [] },
                };
              }

              const data: ApiResponse = await response.json();
              return { category, data };
            } catch (error) {
              console.warn(`${category} 데이터 로드 중 오류: ${error}`);
              return {
                category,
                data: { resultCode: '1', message: '데이터 없음', stocks: [] },
              };
            }
          }),
        );

        const newCategoryData: CategoryDataType = allEndpoints.reduce(
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
                price: formatPrice(item.price.toString(), item.exchangeCode),
                change: formatChange(item.change),
                changePercentage: formatPercentage(item.changeRate.toString()),
                positiveChange: item.positiveChange,
              }),
            );
            newCategoryData[category as Endpoint] = transformedData;
          }
        });
        console.log(results);
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

  // 탭 변경 핸들러 (시장에 따라 다른 상태 업데이트)
  const handleTabChange = (tabType: Endpoint) => {
    if (selectedMarket === 'domestic') {
      setDomesticActiveTab(tabType);
    } else {
      setOverseasActiveTab(tabType);
    }
  };

  // 시장 변경 핸들러
  const handleMarketChange = (market: Market) => {
    setSelectedMarket(market);
  };

  // 현재 선택된 시장에 맞는 탭 옵션 선택
  const currentTabs =
    selectedMarket === 'domestic'
      ? [
          { id: 'domestic/trade-value', label: '거래대금' },
          { id: 'domestic/volume', label: '거래량' },
          { id: 'domestic/rising', label: '급상승' },
          { id: 'domestic/falling', label: '급하락' },
        ]
      : [
          { id: 'overseas/trade-value', label: '거래대금' },
          { id: 'overseas/volume', label: '거래량' },
          { id: 'overseas/rising', label: '급상승' },
          { id: 'overseas/falling', label: '급하락' },
        ];

  const currentTabData = categoryData[activeTab] || [];
  const stockListData =
    initialLoading || error || !currentTabData.length ? [] : currentTabData;

  return (
    <PageContainer>
      <MarketHeader />
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
      {/* 국내/미국 시장 토글 추가 */}
      <MarketToggle
        selectedMarket={selectedMarket}
        onMarketChange={handleMarketChange}
      />

      <SectionTitle>실시간 차트</SectionTitle>

      {/* 탭 옵션을 현재 선택된 시장에 맞게 설정 */}
      <CategoryTabs
        onTabChange={handleTabChange}
        activeTab={activeTab}
        customTabs={currentTabs}
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
        {stockListData.map((stock) => (
          <StockListItem
            key={`${stock.rank}-${stock.stockCode}`}
            rank={stock.rank}
            stockCode={stock.stockCode}
            stockName={stock.stockName}
            price={stock.price}
            change={stock.change}
            changePercentage={stock.changePercentage}
            isPositiveChange={stock.positiveChange}
            isFavorite={false}
            refreshData={refreshData}
          />
        ))}
      </StockListContainer>
      <BottomNavigation state="home" />
    </PageContainer>
  );
}
