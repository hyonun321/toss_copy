// app/hooks/useSignup.ts
import { useState } from 'react';

interface SignupData {
  email: string;
  nickname: string;
  pwd: string; // 백엔드는 'pwd'를 사용함
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/insertMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();

      if (result.includes('가입을 환영합니다')) {
        setSuccess(true);
        return true;
      } else {
        setError(result || '회원가입에 실패했습니다.');
        return false;
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('서버 연결에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    loading,
    error,
    success,
  };
}
