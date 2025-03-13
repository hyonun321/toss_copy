import React from 'react';
import styles from '../page.module.css';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <h1>로그인이 된 상태입니다.</h1>
      <p>이곳은 홈 페이지 내용 예시입니다.</p>
      <Footer />
    </div>
  );
}
