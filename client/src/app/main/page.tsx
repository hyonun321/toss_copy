'use client';
import { Button } from '../components/Button/Button';
import styles from './page.module.css';

export default function Main() {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <h1>주식의 모든 것</h1>
        <h2>도스에서 간편하게</h2>
        <p>스크롤되는 내용 예시입니다. 원하는 요소들을 여기에 배치하세요.</p>
      </div>

      <div className={styles.fixedButton}>
        <Button>이용하기</Button>
      </div>
    </div>
  );
}
