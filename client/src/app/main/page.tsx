'use client';
import { Button } from '../components/Button/Button';
import styles from './page.module.css';
import { ImageText } from '@/app/components/ImageText/ImageText';
export default function Main() {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <div style={{ height: '300px' }} />
        <ImageText
          imageSrc="/images/doss_logo.png"
          alt="도스 로고"
          text={
            <>
              주식의 모든 것
              <br />
              도스에서 간편하게
            </>
          }
        />
        <div style={{ height: '300px' }} />
        <ImageText
          imageSrc="/images/storage.png"
          alt="도스 금고"
          text={
            <>
              보고 싶은 주식을
              <br />
              마음 껏 담으세요
            </>
          }
        />
        <div style={{ height: '300px' }} />
        <ImageText
          imageSrc="/images/wallet.png"
          alt="도스 지갑"
          text={
            <>
              복잡한 검색 없이
              <br />
              내주식을 확인해요
            </>
          }
        />
        <div style={{ height: '300px' }} />
      </div>

      <div className={styles.fixedButton}>
        <Button
          text="이용하기"
          onClick={() => console.log('버튼 클릭')}
          backgroundColor="red"
          textColor="white"
        />
      </div>
    </div>
  );
}
