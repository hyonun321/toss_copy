// PopularStocks.tsx
'use client';
import {
  StocksContainer,
  StockListHeader,
  ListTitle,
  UpdateTime,
  StockList,
  StockItem,
  StockRank,
  StockName,
  StockChange,
  StockItemButton,
} from './PopularStocks.style';
import { BaseStock } from '@/app/types/stock';

interface PopularStocksProps {
  stocks?: BaseStock[];
  loading?: boolean;
  onStockClick?: (stock: BaseStock) => void;
}

export function PopularStocks({ stocks, onStockClick }: PopularStocksProps) {
  // 인기 주식이 없을 경우 더미 데이터 사용
  const displayStocks = stocks || [
    {
      id: 1,
      rank: 1,
      symbol: 'TSLL',
      name: 'TSLL',
      change: '+3.7%',
      isPositive: true,
    },
    {
      id: 2,
      rank: 2,
      symbol: '테슬라',
      name: '테슬라',
      change: '+7.3%',
      isPositive: true,
    },
    {
      id: 3,
      rank: 3,
      symbol: 'NVDA',
      name: '엔비디아',
      change: '-1.9%',
      isPositive: false,
    },
    {
      id: 4,
      rank: 4,
      symbol: 'ETHU',
      name: 'ETHU',
      change: '+0.7%',
      isPositive: true,
    },
    {
      id: 5,
      rank: 5,
      symbol: 'TSLQ',
      name: 'TSLQ',
      change: '+2.3%',
      isPositive: true,
    },
  ];
  const nowTime = new Date();
  const formattedTime = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;

  return (
    <StocksContainer>
      <StockListHeader>
        <ListTitle>인기 주식</ListTitle>
        <UpdateTime>오늘 {formattedTime} 기준</UpdateTime>
      </StockListHeader>
      <StockList>
        {displayStocks.map((stock) => (
          <StockItem key={stock.id}>
            <StockItemButton
              onClick={() => onStockClick && onStockClick(stock)}
            >
              <StockRank>{stock.rank}</StockRank>
              <StockName>{stock.name}</StockName>
              <StockChange isPositive={stock.isPositive || false}>
                {stock.changePercent}%
              </StockChange>
            </StockItemButton>
          </StockItem>
        ))}
      </StockList>
    </StocksContainer>
  );
}
