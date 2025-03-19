'use client';

import REGISTER from '@/app/register/registerview';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePwd() {
  const router = useRouter();
  const handleBackRoute = () => {
    router.push('/setting');
  };
  const handleRoute = () => {
    router.push('/setting');
  };
  return (
    <REGISTER
      title="비밀번호 변경"
      onActionClick={handleBackRoute}
      text="비밀번호를 입력하세요"
      placeholder="비밀번호"
      onNext={handleRoute}
      buttonText="완료"
      validationType="password"
    />
  );
}
