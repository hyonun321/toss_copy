// app/(protected)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { Loading } from '../components/Loading/Loading';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // 서버에 토큰 유효성 검증
        const isValid = await checkAuth();

        if (!isValid) {
          // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
          router.replace('/main');
          return;
        }

        // 인증 확인 완료
        setIsLoading(false);
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        router.replace('/main');
      }
    };

    verifyAuthentication();
  }, [router, checkAuth]);

  // 인증 확인 중에는 로딩 화면 표시
  if (isLoading) {
    return <Loading />;
  }

  // 인증된 사용자에게만 자식 컴포넌트 표시
  return <>{children}</>;
}
