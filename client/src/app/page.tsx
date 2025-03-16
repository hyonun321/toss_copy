'use client';

import { MainView } from './main/page';
import { HomeView } from './home/page';

/*
  실제로는 서버나 쿠키, 세션 등을 통해 로그인 여부를 확인하지만,
  여기서는 간단히 boolean 값으로 대체한다.
*/
const isLoggedIn = true;

export default function Page() {
  if (!isLoggedIn) {
    return <MainView />;
  }
  return <HomeView />;
}
