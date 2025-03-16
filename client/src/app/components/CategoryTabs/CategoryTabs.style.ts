import { theme } from '@/app/theme/theme';
import styled from '@emotion/styled';

export const TabsContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-inline: 16px;
  border-bottom: 1px solid #eee;
`;

export const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${({ active }) =>
    active ? theme.colors.black : theme.colors.boldGray};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
`;

export const TabIndicator = styled.div<{ position: number }>`
  position: absolute;
  bottom: 0;
  left: ${({ position }) => `${position * 25}%`};
  width: 25%;
  height: 2px;
  background-color: #000;
  transition: left 0.3s ease;
`;
