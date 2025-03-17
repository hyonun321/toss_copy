import { theme } from '@/app/theme/theme';
import styled from '@emotion/styled';

export const TabsContainer = styled.div`
  display: flex;
  gap: 32px;
  position: relative;
  width: calc(100% - 32px);
  margin-inline: 16px;
  border-bottom: 1px solid #eee;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 12px 0;
  text-align: left;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${({ active }) =>
    active ? theme.colors.black : theme.colors.boldGray};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  white-space: nowrap;
`;

export const CustomTabIndicator = styled.div`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: #000;
  transition:
    left 0.3s ease,
    width 0.3s ease;
`;
