'use client';

import { FiHome } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useState } from 'react';
import { NavLabel, NavButton, NavContainer } from './BottomNavigation.style';
type NavTab = 'home' | 'mypage';

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  return (
    <NavContainer>
      <NavButton
        active={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        <FiHome size={24} />
        <NavLabel>홈</NavLabel>
      </NavButton>
      <NavButton
        active={activeTab === 'mypage'}
        onClick={() => setActiveTab('mypage')}
      >
        <CgProfile size={24} />
        <NavLabel>마이페이지</NavLabel>
      </NavButton>
    </NavContainer>
  );
}
