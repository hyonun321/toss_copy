import { useState, useEffect } from 'react';
import { useValidation, ValidationType } from './useValidation';

interface UseRegisterProps {
  validationType: ValidationType;
  onNext: (value: string) => void;
  isLoading?: boolean;
}

export const useRegister = ({
  validationType,
  onNext,
  isLoading = false,
}: UseRegisterProps) => {
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const { value, error, handleChange } = useValidation(validationType);

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

  const handleNext = () => {
    if (!error && value && !isLoading) {
      onNext(value);
    }
  };

  return {
    resizeHeight,
    value,
    error,
    handleChange,
    handleNext,
  };
};
