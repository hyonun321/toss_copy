'use client';
import { useMyFunnel } from './funnelcontext';
import React from 'react';
import REGISTER from './registerview';

const RegisterStep: React.FC = () => {
  const funnel = useMyFunnel();
  return (
    <funnel.Render
      email={({ history }) => (
        <REGISTER
          text="이메일을 입력하세요"
          placeholder="이메일 입력"
          onNext={(nickname) => history.push('nickname', { nickname })}
          buttonText="다음"
          validationType="email"
        />
      )}
      nickname={({ history }) => (
        <REGISTER
          text="닉네임을 입력하세요"
          placeholder="닉네임 입력"
          onNext={(password) => history.push('password', { password })}
          buttonText="다음"
          validationType="nickname"
        />
      )}
      password={({ context }) => (
        <REGISTER
          text="비밀번호를 입력하세요"
          placeholder="비밀번호 입력"
          buttonText="회원가입"
          validationType="password"
          onNext={(plantLocation) =>
            console.log('등록 완료:', { ...context, plantLocation })
          }
        />
      )}
    />
  );
};

export default RegisterStep;
