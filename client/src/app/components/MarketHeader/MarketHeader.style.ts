import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  width: 100%;
`;

export const MarketInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MarketName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.black};
`;

export const MarketValue = styled.span<{ negative?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ negative }) => (negative ? theme.colors.blue : theme.colors.red)};
`;

export const MarketChange = styled.span<{ negative?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ negative }) => (negative ? theme.colors.blue : theme.colors.red)};
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
