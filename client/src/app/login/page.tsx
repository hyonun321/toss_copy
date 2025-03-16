'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Button } from '@/app/components/Button/Button';
import { InputField } from '@/app/components/TextField/InputField';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { useLogin } from '@/app/hooks/useLogin';

export default function AuthPage() {
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const { email, setEmail, password, setPassword, error, login } = useLogin({
    onSuccess: () => alert('로그인 성공!'),
  });

  useEffect(() => {
    const resizeHandler = () => {
      if (window.visualViewport) {
        setResizeHeight(window.innerHeight - window.visualViewport.height);
      }
    };

    window.visualViewport?.addEventListener('resize', resizeHandler);
    return () => {
      window.visualViewport?.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <AuthHeader title="로그인" />

      <div className={styles.inputContainer}>
        <InputField
          type="email"
          label="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          label="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      <div
        className={styles.fixedButton}
        style={{ bottom: `calc(16px + ${resizeHeight}px)` }}
      >
        <Button
          text="로그인"
          onClick={login}
          backgroundColor="red"
          textColor="white"
        />
        <Button
          text="회원가입"
          onClick={() => alert('회원가입 페이지로 이동')}
          backgroundColor="red"
          textColor="white"
        />
      </div>
    </div>
  );
}
