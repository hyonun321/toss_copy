import { useState } from 'react';
import {
  getEmailErrorMessage,
  getPasswordErrorMessage,
} from '@/app/utils/validation';

interface UseLoginProps {
  onSuccess: () => void;
}

interface LoginResponse {
  nickname?: string;
  Authorization?: string;
  msg?: string;
}

export function useLogin({ onSuccess }: UseLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError(null);

    // 클라이언트 측 유효성 검사 - 유틸리티 함수 사용
    const emailError = getEmailErrorMessage(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = getPasswordErrorMessage(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    console.log(email, password);
    try {
      const response = await fetch('http://localhost:8080/tokenLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pwd: password,
        }),
      });

      const data: LoginResponse = await response.json();
      console.log(data);
      if (data.Authorization && data.nickname) {
        sessionStorage.setItem('authToken', data.Authorization);
        sessionStorage.setItem('nickname', data.nickname);
        onSuccess();
      } else {
        setError(data.msg || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    login,
  };
}
