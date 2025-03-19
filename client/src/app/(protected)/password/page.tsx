'use client';

import { useState, useEffect } from 'react';
import REGISTER from '@/app/(public)/register/registerview';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

export default function ChangePwd() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 현재 비밀번호, 2: 새 비밀번호
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();
  const { changePassword } = useAuthStore();

  useEffect(() => {
    setServerError(null);
  }, [step]);

  const handleBackRoute = () => {
    if (step === 2) {
      setStep(1); // 새 비밀번호 입력 중이면 현재 비밀번호 입력으로 돌아감
      setServerError(null); // 명시적으로 에러 초기화
      return;
    }
    router.push('/setting');
  };

  const handleNextStep = async (password: string) => {
    setServerError(null);

    if (step === 1) {
      // 현재 비밀번호 저장
      setCurrentPassword(password);
      setStep(2);
      return true;
    } else {
      try {
        const result = await changePassword({
          currentPassword,
          newPassword: password,
        });

        if (result.success) {
          router.push('/setting');
          return true;
        } else {
          setServerError(result.error || '비밀번호 변경에 실패했습니다.');
          return false;
        }
      } catch (e) {
        setServerError(`오류가 발생했습니다. ${e}`);
        return false;
      }
    }
  };

  return (
    <REGISTER
      key={`password-step-${step}`}
      title="비밀번호 변경"
      onActionClick={handleBackRoute}
      text={
        step === 1 ? '현재 비밀번호를 입력하세요' : '새 비밀번호를 입력하세요'
      }
      placeholder={step === 1 ? '현재 비밀번호' : '새 비밀번호'}
      onNext={handleNextStep}
      buttonText={step === 1 ? '다음' : '완료'}
      validationType="password"
      serverError={serverError}
    />
  );
}
