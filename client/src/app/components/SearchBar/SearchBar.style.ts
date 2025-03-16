import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';
export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
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
  color: ${theme.colors.littleGray};
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
