'use client';
import React, { useEffect, useState } from 'react';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { InputField } from '@/app/components/TextField/InputField';
import { Buttonv2 } from '@/app/components/Buttonv2/Buttonv2';
import { useValidation, ValidationType } from '@/app/hooks/useValidation';
import { Title } from '@/app/components/Title/Title';
import {
  Container,
  InputContainer,
  TitleContainer,
  FixedButton,
  ErrorMessage,
} from './styles';

type RegisterProps = {
  title: string;
  text: string;
  placeholder: string;
  onNext: (value: string) => void;
  buttonText: string;
  validationType: ValidationType;
  onActionClick?: () => void;
  isLoading?: boolean;
  serverError?: string | null;
};

export const Register = ({
  title,
  text,
  placeholder,
  onNext,
  buttonText,
  validationType,
  onActionClick,
  isLoading = false,
  serverError,
}: RegisterProps) => {
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

  return (
    <Container>
      <AuthHeader title={title} onActionClick={onActionClick} />
      <TitleContainer>
        <Title>{text}</Title>
      </TitleContainer>
      <InputContainer>
        <InputField
          type={validationType === 'password' ? 'password' : 'text'}
          label={placeholder}
          value={value}
          onChange={handleChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!error && serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      </InputContainer>

      <FixedButton resizeHeight={resizeHeight}>
        <Buttonv2
          text={buttonText}
          onClick={handleNext}
          backgroundColor="red"
          textColor="white"
        />
      </FixedButton>
    </Container>
  );
};

export default Register;
