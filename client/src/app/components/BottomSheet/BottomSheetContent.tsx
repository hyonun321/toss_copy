import React from 'react';
import {
  BottomSheetContainer,
  TopBar,
  Title,
  LeftIcon,
  ImageContainer,
  StyledImage,
  Description,
  ButtonContainer,
  LeftButton,
  RightButton,
} from './BottomSheetContent.style';

interface BottomSheetContentProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  description?: string;
  leftIcon?: string;
  leftButtonText: string;
  rightButtonText: string;
  onClose?: () => void;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  title,
  imageSrc,
  imageAlt = 'image',
  description,
  leftIcon,
  leftButtonText,
  rightButtonText,
  onClose,
  onLeftClick,
  onRightClick,
}) => {
  return (
    <BottomSheetContainer>
      {/* 상단 바 */}
      <TopBar>
        {leftIcon && (
          <LeftIcon
            width={25}
            height={25}
            src={leftIcon}
            alt="icon"
            onClick={onClose} // 왼쪽 아이콘 클릭 시 모달 닫기
          />
        )}
        <Title>{title}</Title>
      </TopBar>

      {/* 이미지 & 설명 */}
      {imageSrc && (
        <ImageContainer>
          <StyledImage height={100} width={100} src={imageSrc} alt={imageAlt} />
          {description && <Description>{description}</Description>}
        </ImageContainer>
      )}

      {/* 버튼 2개 */}
      <ButtonContainer>
        <LeftButton onClick={onLeftClick}>{leftButtonText}</LeftButton>
        <RightButton onClick={onRightClick}>{rightButtonText}</RightButton>
      </ButtonContainer>
    </BottomSheetContainer>
  );
};

export default BottomSheetContent;
