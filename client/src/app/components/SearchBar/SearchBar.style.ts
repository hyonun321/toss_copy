import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';
export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  position: relative;
  z-index: 10;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchInputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: ${theme.colors.littleGray};
  border-radius: 20px;
  padding: 0 12px;
  height: 40px;
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  align-items: center;
  font-size: 16px;
  outline: none;
  color: ${theme.colors.black};
  &::placeholder {
    color: ${theme.colors.boldGray};
  }
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 새로 추가할 스타일
export const SearchResultsContainer = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
  z-index: 20;
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
      case 'tesla':
        return '#e74c3c';
      case 'etf':
        return '#e74c3c';
      case 'kodex':
        return '#2980b9';
      case 'inverse':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  }};
`;

export const CountryFlag = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 10px;
`;

export const LeverageTag = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  color: #e74c3c;
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
  font-size: 16px;
`;

export const StockDescription = styled.div`
  color: ${theme.colors.boldGray};
  font-size: 14px;
  margin-top: 4px;
`;

export const HighlightText = styled.span`
  color: #3498db;
  font-weight: 500;
`;

export const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: ${theme.colors.boldGray};
`;
