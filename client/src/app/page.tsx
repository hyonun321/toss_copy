'use client';

import dynamic from 'next/dynamic';
import { useAuthStore } from '@/app/stores/authStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from './components/Loading/Loading';

const DynamicHomeView = dynamic(
  () => import('./(protected)/home/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);
const DynamicMainView = dynamic(
  () => import('./(public)/main/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);

export default function Page() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        const isValid = await checkAuth();

        if (!isValid) {
          router.replace('/main');
          return;
        }

        setAuthStatus(true);
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        router.replace('/main');
      }
    };

    verifyAuthentication();
  }, [router, checkAuth]);

  if (authStatus === null) {
    return <Loading />;
  }

  if (!authStatus) {
    return <DynamicMainView />;
  }

  return <DynamicHomeView />;
}
