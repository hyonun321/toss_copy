'use client';

import dynamic from 'next/dynamic';
import { isAuthenticated } from './utils/auth';
import { useState, useEffect } from 'react';
import Image from 'next/image';
const DynamicHomeView = dynamic(
  () => import('./home/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);
const DynamicMainView = dynamic(
  () => import('./main/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);

export default function Page() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setAuthStatus(authenticated);
    };

    checkAuth();
  }, []);

  if (authStatus === null) {
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
        <Image width={100} height={100} src="/images/loading.gif" />
      </div>
    );
  }

  if (!authStatus) {
    return <DynamicMainView />;
  }

  return <DynamicHomeView />;
}
