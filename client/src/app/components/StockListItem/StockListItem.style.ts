import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
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

export const RankContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-left: 16px;
`;

export const Rank = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #2d7af6;
  margin-right: 16px;
`;

export const StockMarker = styled.div`
  width: 45px;
  height: 45px;
  background-color: #f0f0f0;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #666;
`;

export const StockInfoContainer = styled.div`
  flex: 1;
  display: flex;
  margin: 8px 4px;
  flex-direction: column;
`;

export const StockName = styled.span`
  font-size: 16px;
  font-weight: 600;
  display: flex;
`;

export const StockCode = styled.span`
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 8px;
  margin-bottom: 4px;
`;

export const Price = styled.span`
  font-size: 14px;
  color: ${theme.colors.boldGray};
`;

export const ChangeText = styled.span<{ isPositive: boolean }>`
  font-size: 14px;
  font-weight: 400;
  color: ${({ isPositive }) =>
    isPositive ? theme.colors.red : theme.colors.blue};
`;

export const FavoriteButton = styled.button`
  background: none;
  border: none;
  display: flex;
  cursor: pointer;
  padding-right: 24px;
`;
