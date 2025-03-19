'use client';

import { FiHome } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useState } from 'react';
import { NavLabel, NavButton, NavContainer } from './BottomNavigation.style';
import { useRouter } from 'next/navigation';

interface BottomNavigationProps {
  state: string;
}
export function BottomNavigation({ state }: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState<string>(state);
  const router = useRouter();
  return (
    <NavContainer>
      <NavButton
        active={activeTab === 'home'}
        onClick={() => {
          setActiveTab('home');
          router.push('home');
        }}
      >
        <FiHome size={24} />
        <NavLabel>홈</NavLabel>
      </NavButton>
      <NavButton
        active={activeTab === 'mypage'}
        onClick={() => {
          setActiveTab('mypage');
          router.push('mypage');
        }}
      >
        <CgProfile size={24} />
        <NavLabel>마이페이지</NavLabel>
      </NavButton>
    </NavContainer>
  );
}
