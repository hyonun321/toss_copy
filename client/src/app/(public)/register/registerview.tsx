'use client';
import React from 'react';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { InputField } from '@/app/components/TextField/InputField';
import { Buttonv2 } from '@/app/components/Buttonv2/Buttonv2';
import { ValidationType } from '@/app/hooks/useValidation';
import { Title } from '@/app/components/Title/Title';
import { useRegister } from '@/app/hooks/useRegister';
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
  const { resizeHeight, value, error, handleChange, handleNext } = useRegister({
    validationType,
    onNext,
    isLoading,
  });

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
