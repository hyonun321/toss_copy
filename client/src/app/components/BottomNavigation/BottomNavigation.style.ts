import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';
export const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  border-top: 1px solid #eee;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const NavButton = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  color: ${({ active }) =>
    active ? theme.colors.black : theme.colors.boldGray};
  transition: color 0.2s ease;
`;

export const NavLabel = styled.span`
  font-size: 12px;
  margin-top: 4px;
`;
