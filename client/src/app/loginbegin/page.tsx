'use client';

import styles from './page.module.css';
import Title from '@/app/components/Title/Title';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { Button } from '@/app/components/Button/Button';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  const handleRouteBack = () => {
    router.push('/main');
  };

  return (
    <div className={styles.container}>
      <AuthHeader onActionClick={handleRouteBack} />
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
          onClick={() => router.push('/login')}
          backgroundColor="red"
          textColor="white"
        />
      </footer>
    </div>
  );
}
