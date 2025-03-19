'use client';

import REGISTER from '@/app/register/registerview';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ChangeName() {
  const router = useRouter();
  const handleBackRoute = () => {
    router.push('/setting');
  };
  const handleRoute = () => {
    router.push('/setting');
  };
  return (
    <REGISTER
      title="닉네임 변경"
      onActionClick={handleBackRoute}
      text="닉네임을 입력하세요"
      placeholder="닉네임 입력"
      onNext={handleRoute}
      buttonText="완료"
      validationType="nickname"
    />
  );
}
