'use client';
import { useState } from 'react';
import { validateInput } from '@/app/utils/validation';

export type ValidationType = 'email' | 'nickname' | 'password';

export function useValidation(type: ValidationType) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // 유틸리티 함수를 사용하여 유효성 검증
    const errorMessage = validateInput(inputValue, type);
    setError(errorMessage);
  };

  return { value, setValue, error, handleChange };
}
