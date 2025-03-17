// PopularStocks.style.ts
import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';
export const StocksContainer = styled.div`
  background-color: #fff;
`;

export const StockListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

export const ListTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.boldGray};
  margin: 0;
`;

export const UpdateTime = styled.span`
  font-size: 12px;
  color: ${theme.colors.boldGray};
`;

export const StockList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
export const StockItem = styled.li`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const StockItemButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  border: none;

  background-color: ${theme.colors.white};
  border-radius: 16px;
  transition:
    transform 0.15s ease,
    filter 0.15s ease,
    opacity 0.15s ease;

  &:active {
    transform: scale(0.97);
    filter: brightness(0.97);
  }
`;

export const StockRank = styled.span`
  width: 24px;
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.blue};
  margin-right: 16px;
`;

export const StockName = styled.span`
  flex: 1;
  font-size: 16px;
  color: #111;
`;

export const StockChange = styled.span<{ isPositive: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.isPositive ? '#F03E3E' : '#1971C2')};
`;
