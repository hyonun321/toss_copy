import { useState } from 'react';

interface UseLoginProps {
  onSuccess: () => void;
}

export function useLogin({ onSuccess }: UseLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);

    try {
      const response = await fakeLoginAPI(email, password);
      if (response.success) {
        onSuccess();
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로그인에 실패했습니다.');
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    login,
  };
}

const fakeLoginAPI = async (email: string, password: string) => {
  return new Promise<{ success: boolean }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: email === 'test@test.com' && password === 'password',
        }),
      1000,
    ),
  );
};
