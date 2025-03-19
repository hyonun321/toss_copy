'use client';
import React, { useEffect, useState } from 'react';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { InputField } from '@/app/components/TextField/InputField';
import { Buttonv2 } from '@/app/components/Buttonv2/Buttonv2';
import { useValidation, ValidationType } from '@/app/hooks/useValidation';
import Title from '@/app/components/Title/Title';
import styles from './page.module.css';

type RegisterProps = {
  title: string;
  text: string;
  placeholder: string;
  onNext: (value: string) => void;
  buttonText: string;
  validationType: ValidationType;
  onActionClick?: () => void;
};

const REGISTER: React.FC<RegisterProps> = ({
  title,
  text,
  placeholder,
  onNext,
  buttonText,
  validationType,
  onActionClick,
}) => {
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
    if (!error && value) {
      onNext(value);
    }
  };

  return (
    <div className={styles.container}>
      <AuthHeader title={title} onActionClick={onActionClick} />
      <div className={styles.title}>
        <Title>{text}</Title>
      </div>
      <div className={styles.inputContainer}>
        <InputField
          type={validationType === 'password' ? 'password' : 'text'}
          label={placeholder}
          value={value}
          onChange={handleChange}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      <div
        className={styles.fixedButton}
        style={{ bottom: `calc(16px + ${resizeHeight}px)` }}
      >
        <Buttonv2
          text={buttonText}
          onClick={handleNext}
          backgroundColor="red"
          textColor="white"
        />
      </div>
    </div>
  );
};

export default REGISTER;
