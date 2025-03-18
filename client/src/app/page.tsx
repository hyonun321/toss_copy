'use client';

import dynamic from 'next/dynamic';
import { isAuthenticated } from './utils/auth';

const DynamicHomeView = dynamic(
  () => import('./home/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);
const DynamicMainView = dynamic(
  () => import('./main/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);

export default function Page() {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return <DynamicMainView />;
  }
  return <DynamicHomeView />;
}
