import styled from '@emotion/styled';
import Image from 'next/image';

// 바텀시트 컨테이너
export const BottomSheetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: white;
  border-radius: 16px 16px 0 0;
`;

// 상단 바
export const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 56px;
  margin-bottom: 16px;
`;

// 제목
export const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #131214;
`;

// 왼쪽 아이콘
export const LeftIcon = styled(Image)`
  width: 28px;
  height: 28px;
  position: absolute;
  left: 8px;
  cursor: pointer;
`;

// 이미지 컨테이너
export const ImageContainer = styled.div`
  display: inline-block;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 70px 30px;
`;

// 이미지
export const StyledImage = styled(Image)`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
`;

// 설명
export const Description = styled.p`
  margin-top: 15px;
  font-size: 18px;
  color: #0a0a0a;
`;

// 버튼 컨테이너
export const ButtonContainer = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  position: absolute;
  justify-content: space-between;
  bottom: 5px;
`;

// 버튼 기본 스타일
export const Button = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

// 왼쪽 버튼 (연한 배경)
export const LeftButton = styled(Button)`
  background: #ffe8e8;
  color: #df0417;
  margin-right: 8px;
`;

// 오른쪽 버튼 (강조된 배경)
export const RightButton = styled(Button)`
  background: #df0417;
  color: white;
`;
