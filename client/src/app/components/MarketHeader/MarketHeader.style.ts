import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  width: 100%;
`;

export const MarketInfoWrapper = styled.div`
  width: 100%;
  height: 30px;
  overflow: hidden;
  position: relative;
`;

export const RollingContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const RollingList = styled.ul<{ isAnimating: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  transform: ${({ isAnimating }) =>
    isAnimating ? 'translateY(-30px)' : 'translateY(0)'};
  transition: ${({ isAnimating }) =>
    isAnimating ? 'transform 2s ease-in-out' : 'none'};
`;

export const RollingItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: baseline; /* Changed from center to baseline */
  height: 30px;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.black};
  span {
    /* For the name specifically */
    margin-right: 8px;
    flex-grow: 0; /* Don't allow shrinking */
    white-space: nowrap; /* Prevent wrapping */
  }
`;

export const MarketValue = styled.span<{ negative?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ negative }) => (negative ? theme.colors.blue : theme.colors.red)};
`;

export const MarketChangePercent = styled.span<{ negative?: boolean }>`
  font-size: 14px;
  font-weight: 400;
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
