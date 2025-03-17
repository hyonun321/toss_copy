'use client';

import styles from './page.module.css';
import Title from '@/app/components/Title/Title';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { Button } from '@/app/components/Button/Button';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';

export default function Home() {
  return (
    <div className={styles.container}>
      <AuthHeader></AuthHeader>
      <main className={styles.main}>
        <Title>
          도스를 시작하려면
          <br />
          로그인 해주세요
        </Title>
        <ImageText
          imageSrc="/images/doss_logo.png"
          enableAnimation={true}
          alt="도스 로고"
        />
      </main>

      <footer className={styles.footer}>
        <Button
          text="로그인"
          onClick={() => console.log('버튼 클릭')}
          backgroundColor="red"
          textColor="white"
        />
      </footer>
    </div>
  );
}
