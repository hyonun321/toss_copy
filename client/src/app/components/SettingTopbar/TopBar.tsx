'use client';

import { useRouter } from 'next/navigation';
import { TopBarContainer, BackIcon, Title } from './TobBar.style';

export const TopBar = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/home');
  };

  return (
    <TopBarContainer>
      <BackIcon
        width={32}
        height={32}
        alt="Back"
        src="/images/arrow-left.png"
        onClick={handleBackClick}
      />
      <Title>설정</Title>
    </TopBarContainer>
  );
};
