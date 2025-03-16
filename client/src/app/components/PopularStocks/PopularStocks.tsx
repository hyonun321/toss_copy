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
import { theme } from '@/app/theme/theme';
import { PopularStockItem } from '@/app/types';

interface PopularStocksProps {
  stocks?: PopularStockItem[];
  onStockClick?: (stock: PopularStockItem) => void;
}

export function PopularStocks({
  stocks = [
    { id: 1, rank: 1, name: 'TSLL', change: '+3.7%', isPositive: true },
    { id: 2, rank: 2, name: '테슬라', change: '+7.3%', isPositive: true },
    { id: 3, rank: 3, name: '엔비디아', change: '-1.9%', isPositive: false },
    { id: 4, rank: 4, name: 'ETHU', change: '+0.7%', isPositive: true },
    { id: 5, rank: 5, name: 'TSLQ', change: '+2.3%', isPositive: true },
  ],
  onStockClick,
}: PopularStocksProps) {
  return (
    <StocksContainer>
      <StockListHeader>
        <ListTitle>인기 주식</ListTitle>
        <UpdateTime>오늘 18:49 기준</UpdateTime>
      </StockListHeader>
      <StockList>
        {stocks.map((stock) => (
          <StockItem key={stock.id}>
            <StockItemButton
              onClick={() => onStockClick && onStockClick(stock)}
            >
              <StockRank>{stock.rank}</StockRank>
              <StockName>{stock.name}</StockName>
              <StockChange isPositive={stock.isPositive}>
                {stock.change}
              </StockChange>
            </StockItemButton>
          </StockItem>
        ))}
      </StockList>
    </StocksContainer>
  );
}
