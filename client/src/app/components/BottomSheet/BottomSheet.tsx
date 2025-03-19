import React from 'react';
import styles from './Bottom.module.css';

interface BottomSheetProps {
  children: React.ReactNode;
  height?: string; // 바텀시트 높이 조정 가능
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  height = '25vh',
}) => {
  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.sheet} style={{ height }}>
        <div className={styles.handle}></div>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

export default BottomSheet;
