'use client';

import { FiSearch, FiMenu } from 'react-icons/fi';
import {
  HeaderContainer,
  MarketInfo,
  MarketValue,
  MarketChange,
  MarketName,
  IconContainer,
  IconButton,
} from './MarketHeader.style';
import { useRouter } from 'next/navigation';

interface MarketHeaderProps {
  onRefresh: () => void;
}

export function MarketHeader(onRefresh: MarketHeaderProps) {
  const router = useRouter();
  console.log(
    onRefresh,
    '추후에 주식정보 실시간으로 불러와서 롤링컴포넌트 사용할 예정',
  );
  const handleRouteSearch = () => {
    router.push('/search');
  };
  const handleRouteSetting = () => {
    router.push('/setting');
  };
  return (
    <HeaderContainer>
      <MarketInfo>
        <MarketName>나스닥</MarketName>
        <MarketValue negative>17,251.32</MarketValue>
        <MarketChange negative>-4.0%</MarketChange>
      </MarketInfo>
      <IconContainer>
        <IconButton onClick={handleRouteSearch}>
          <FiSearch size={24} />
        </IconButton>
        <IconButton onClick={handleRouteSetting}>
          <FiMenu size={24} />
        </IconButton>
      </IconContainer>
    </HeaderContainer>
  );
}
