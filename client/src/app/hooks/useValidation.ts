'use client';
import { useState } from 'react';

export type ValidationType = 'email' | 'nickname' | 'password';

export function useValidation(type: ValidationType) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (inputValue: string) => {
    let errorMessage = '';

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        errorMessage = '올바른 이메일 형식이 아닙니다.';
      }
    }

    if (type === 'nickname') {
      const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
      if (!nicknameRegex.test(inputValue)) {
        errorMessage = '닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.';
      }
    }

    if (type === 'password') {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
      if (!passwordRegex.test(inputValue)) {
        errorMessage =
          '비밀번호는 8~16자의 영문, 숫자, 특수문자를 포함해야 합니다.';
      }
    }

    setError(errorMessage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    validate(inputValue);
  };

  return { value, setValue, error, handleChange };
}
