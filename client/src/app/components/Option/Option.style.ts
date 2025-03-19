import styled from '@emotion/styled';
import Image from 'next/image';
import { theme } from '@/app/theme/theme';
// 전체 옵션 컨테이너
export const OptionContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 16px;
  background-color: ${theme.colors.white};
  transition:
    transform 0.15s ease,
    filter 0.15s ease,
    opacity 0.15s ease;

  cursor: pointer;
  &:active {
    transform: scale(0.97);
    filter: brightness(0.97);
  }
`;

// 아이콘과 레이블을 포함하는 왼쪽 영역
export const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
`;

// 아이콘 스타일링
export const StyledIcon = styled(Image)`
  width: 24px;
  height: 24px;
`;

// 옵션 레이블 텍스트
export const Label = styled.div`
  font-size: 16px;
`;

// 토글 스위치 컨테이너
export const ToggleContainer = styled.div<{ isActive: boolean }>`
  width: 56px;
  height: 32px;
  border-radius: 32px;
  background-color: ${(props) => (props.isActive ? '#4caf50' : '#e6e9eb')};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  display: flex;
  align-items: center;
`;

// 토글 스위치 내부 동그라미(노브)
export const Knob = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s ease-in-out;
  transform: ${(props) =>
    props.isActive ? 'translateX(24px)' : 'translateX(0)'};
`;

// 화살표 아이콘
export const ChevronIcon = styled(Image)`
  cursor: pointer;
`;
