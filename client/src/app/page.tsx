'use client';

import dynamic from 'next/dynamic';

const DynamicHomeView = dynamic(
  () => import('./home/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);
const DynamicMainView = dynamic(
  () => import('./main/page').then((mod) => mod.default),
  { ssr: false }, // 하이드레이션 방지 : 서버 사이드 렌더링 비활성화
);
/*
  실제로는 서버나 쿠키, 세션 등을 통해 로그인 여부를 확인하지만,
  여기서는 간단히 boolean 값으로 대체한다.
*/
const isLoggedIn = false;

export default function Page() {
  if (!isLoggedIn) {
    return <DynamicMainView />;
  }
  return <DynamicHomeView />;
}
