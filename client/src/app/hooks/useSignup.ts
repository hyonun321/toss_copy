// hooks/useSignup.ts
import { useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';

interface SignupData {
  email: string;
  nickname: string;
  pwd: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Zustand 스토어에서 회원가입 및 로그인 함수 가져오기
  const { signup: storeSignup, login: storeLogin } = useAuthStore();

  const registerUser = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      // 중앙화된 회원가입 로직 사용
      const result = await storeSignup(data);

      if (result.success) {
        setSuccess(true);
        return true;
      } else {
        setError(result.error || '회원가입에 실패했습니다.');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  // 기존 코드와의 호환성을 위해 autoLogin 함수도 Zustand 스토어 사용
  async function autoLogin(email: string, password: string) {
    try {
      const result = await storeLogin(email, password);
      return result.success;
    } catch (err) {
      console.error('자동 로그인 오류:', err);
      return false;
    }
  }

  return {
    registerUser,
    autoLogin,
    loading,
    error,
    success,
  };
}
