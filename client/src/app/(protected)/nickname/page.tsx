'use client';

import { Register as REGISTER } from '@/app/(public)/register/registerview';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

export default function ChangeName() {
  const [error, setError] = useState<string | null>(null);
  const { nickname, changeNickname } = useAuthStore();
  const router = useRouter();

  const handleBackRoute = () => {
    router.push('/setting');
  };

  const handleNicknameChange = async (newNickname: string) => {
    if (!newNickname || newNickname.trim() === '') {
      setError('닉네임을 입력해주세요.');
      return false;
    }

    // 현재 닉네임과 같다면 바로 성공 처리
    if (newNickname === nickname) {
      router.push('/setting');
      return true;
    }

    const result = await changeNickname(newNickname);

    if (result.success) {
      router.push('/setting');
      return true;
    } else {
      setError(result.error || '닉네임 변경에 실패했습니다.');
      return false;
    }
  };

  return (
    <REGISTER
      title="닉네임 변경"
      onActionClick={handleBackRoute}
      text="닉네임을 입력하세요"
      placeholder="닉네임 입력"
      onNext={handleNicknameChange}
      buttonText="완료"
      validationType="nickname"
      serverError={error}
    />
  );
}
