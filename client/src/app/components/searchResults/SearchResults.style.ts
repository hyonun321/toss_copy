import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const SearchResultsContainer = styled.div`
  padding: 8px 0;
`;

export const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.littleGray};
  }
`;

export const StockLogo = styled.div<{ logoType: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${(props) => {
    switch (props.logoType) {
      case 'us':
        return theme.colors.blue;
      case 'kr':
        return theme.colors.gray;
      default:
        return theme.colors.white;
    }
  }};
`;

export const CountryFlag = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 9px;
  background-color: ${theme.colors.white};
  border-radius: 25px;
`;

export const LeverageTag = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  color: ${theme.colors.lightGray};
  font-size: 10px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 10px;
`;

export const StockInfo = styled.div`
  flex: 1;
`;

export const StockSymbol = styled.div`
  font-weight: 500;
  color: ${theme.colors.boldGray};
  font-size: 14px;
`;

export const StockDescription = styled.div`
  color: ${theme.colors.black};
  font-size: 16px;
  margin-top: 4px;
`;

export const HighlightText = styled.span`
  color: ${theme.colors.blue};
  font-weight: 500;
`;

export const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: ${theme.colors.boldGray};
`;
