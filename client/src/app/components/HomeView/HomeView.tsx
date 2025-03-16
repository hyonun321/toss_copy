'use client';

import { MarketHeader } from '@/app/components/MarketHeader/MarketHeader';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { StockListItem } from '@/app/components/StockListItem/StockListItem';
import { BottomNavigation } from '@/app/components/BottomNavigation/BottomNavigation';
import {
  PageContainer,
  SectionTitle,
  StockListContainer,
} from './HomeView.style';
const stockListData = [
  {
    rank: 1,
    stockCode: '11,589원',
    stockName: 'TSLL',
    price: '11,589원',
    change: '+7.7%',
    changePercentage: '+7.7%',
    isPositiveChange: true,
    isFavorite: false,
  },
  {
    rank: 2,
    stockCode: '337,024원',
    stockName: '테슬라',
    price: '337,024원',
    change: '+4.6%',
    changePercentage: '+4.6%',
    isPositiveChange: true,
    isFavorite: true,
  },
  {
    rank: 3,
    stockCode: '93,546원',
    stockName: 'TSLQ',
    price: '93,546원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: true,
  },
  {
    rank: 4,
    stockCode: '55,116원',
    stockName: 'S&P 500',
    price: '55,116원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: false,
  },
  {
    rank: 5,
    stockCode: '35,526원',
    stockName: 'NVDL',
    price: '35,526원',
    change: '-1.6%',
    changePercentage: '-1.6%',
    isPositiveChange: false,
    isFavorite: true,
  },
];

export function HomeView() {
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
      <CategoryTabs />
      <StockListContainer>
        {stockListData.map((stock) => (
          <StockListItem
            key={stock.rank}
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
