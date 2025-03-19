'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import Image from 'next/image';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      // 서버와 토큰 재검증
      const isValid = await checkAuth();

      if (!isValid) {
        router.replace('/main');
      }

      setIsLoading(false);
    };

    verifyAuth();
  }, [checkAuth, router]);

  // 인증 확인 중에는 로딩 화면 표시
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <Image
          width={36}
          height={36}
          alt="로딩 중"
          src="/images/doss_logo.png"
        />
      </div>
    );
  }

  // 여기까지 왔다면 인증된 상태
  return <>{children}</>;
}
