// hooks/useLogin.ts
import { useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import {
  getEmailErrorMessage,
  getPasswordErrorMessage,
} from '@/app/utils/validation';

interface UseLoginProps {
  onSuccess: () => void;
}

export function useLogin({ onSuccess }: UseLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Zustand 스토어에서 로그인 함수 가져오기
  const { login: storeLogin } = useAuthStore();

  const login = async () => {
    setError(null);

    // 클라이언트 측 유효성 검사
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

    try {
      // 중앙화된 로그인 로직 사용
      const result = await storeLogin(email, password);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
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
