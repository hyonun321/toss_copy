'use client';
import { Button } from '../../../components/Button/Button';
import { ViewContainer } from '../../../components/viewContainer/viewContainer';
import styles from './MainView.module.css';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { useRouter } from 'next/navigation';
export function MainView() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <ViewContainer>
          <ImageText
            imageSrc="/images/doss_logo.png"
            enableAnimation={true}
            alt="도스 로고"
            text={
              <>
                주식의 모든 것
                <br />
                도스에서 간편하게
              </>
            }
          />
        </ViewContainer>
        <ViewContainer>
          <ImageText
            imageSrc="/images/storage.png"
            alt="도스 금고"
            enableAnimation={true}
            text={
              <>
                보고 싶은 주식을
                <br />
                마음 껏 담으세요
              </>
            }
          />
        </ViewContainer>
        <ViewContainer>
          <ImageText
            imageSrc="/images/wallet.png"
            alt="도스 지갑"
            enableAnimation={true}
            text={
              <>
                복잡한 검색 없이
                <br />
                내주식을 확인해요
              </>
            }
          />
        </ViewContainer>
      </div>

      {/* TODO: Footer로 속성을 넣어서 정리가능 */}
      <div className={styles.fixedButton}>
        <Button
          text="이용하기"
          onClick={() => router.push('/loginbegin')}
          backgroundColor="red"
          textColor="white"
        />
      </div>
    </div>
  );
}
