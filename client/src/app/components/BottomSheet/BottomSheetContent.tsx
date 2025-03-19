import React from 'react';
import styles from './BottomSheetContent.module.css';

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
    <div className={styles.bottomSheetContainer}>
      {/* 상단 바 */}
      <div className={styles.topBar}>
        {leftIcon && (
          <img
            src={leftIcon}
            alt="icon"
            className={styles.leftIcon}
            onClick={onClose} // 왼쪽 아이콘 클릭 시 모달 닫기
          />
        )}
        <h2 className={styles.title}>{title}</h2>
      </div>

      {/* 이미지 & 설명 */}
      {imageSrc && (
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} />
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {/* 버튼 2개 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.leftButton}`}
          onClick={onLeftClick}
        >
          {leftButtonText}
        </button>
        <button
          className={`${styles.button} ${styles.rightButton}`}
          onClick={onRightClick}
        >
          {rightButtonText}
        </button>
      </div>
    </div>
  );
};

export default BottomSheetContent;
