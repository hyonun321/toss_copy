import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const ToggleContainer = styled.div`
  display: flex;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 30px;
  width: 200px;
  height: 40px;
  margin: 20px auto 5px auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ToggleOption = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  font-size: 14px;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${(props) => (props.isActive ? theme.colors.primary : '#888')};
  cursor: pointer;
  z-index: 2;
  transition: color 0.3s ease;
`;

export const ToggleSlider = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.position === 'left' ? '2px' : '50%')};
  width: calc(50% - 4px);
  height: calc(100% - 4px);
  background-color: white;
  border-radius: 28px;
  transition: left 0.3s ease;
  z-index: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
