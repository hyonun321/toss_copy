'use client';
import { useMyFunnel } from './funnelcontext';
import React, { useState } from 'react';
import REGISTER from './registerview';
import { useRouter } from 'next/navigation';
import { useSignup } from '../../hooks/useSignup';

const RegisterStep: React.FC = () => {
  const handleRouteBack = () => {
    funnel.history.go(-1);
  };
  const funnel = useMyFunnel();
  const router = useRouter();
  const { registerUser, loading, error, autoLogin } = useSignup();
  const [signupError, setSignupError] = useState<string | null>(null);

  async function handleSignup(
    context: { nickname: string; password: string },
    plantLocation: string,
  ) {
    const userData = {
      email: context.nickname,
      nickname: context.password,
      pwd: plantLocation,
    };

    const success = await registerUser(userData);

    if (success) {
      await autoLogin(userData.email, userData.pwd);
      router.push('/onboarding');
    } else {
      // 실패 시 에러 상태 업데이트
      setSignupError(error || '회원가입에 실패했습니다.');
    }
  }
  return (
    <funnel.Render
      email={({ history }) => (
        <REGISTER
          title="회원가입"
          onActionClick={handleRouteBack}
          text="이메일을 입력하세요"
          placeholder="이메일 입력"
          onNext={(nickname) => history.push('nickname', { nickname })}
          buttonText="다음"
          validationType="email"
        />
      )}
      nickname={({ history }) => (
        <REGISTER
          title="회원가입"
          onActionClick={handleRouteBack}
          text="닉네임을 입력하세요"
          placeholder="닉네임 입력"
          onNext={(password) => history.push('password', { password })}
          buttonText="다음"
          validationType="nickname"
        />
      )}
      password={({ context }) => (
        <REGISTER
          title="회원가입"
          onActionClick={handleRouteBack}
          text="비밀번호를 입력하세요"
          placeholder="비밀번호 입력"
          buttonText="회원가입"
          validationType="password"
          isLoading={loading}
          serverError={signupError}
          onNext={(plantLocation) => {
            handleSignup(context, plantLocation);
          }}
        />
      )}
    />
  );
};

export default RegisterStep;
