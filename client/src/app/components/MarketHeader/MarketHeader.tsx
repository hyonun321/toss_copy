'use client';

import { FiSearch, FiMenu } from 'react-icons/fi';
import {
  HeaderContainer,
  MarketInfoWrapper,
  RollingContainer,
  RollingList,
  RollingItem,
  IconContainer,
  IconButton,
  MarketValue,
  MarketChange,
} from './MarketHeader.style';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MarketHeaderProps {
  onRefresh: () => void;
}

export function MarketHeader({ onRefresh }: MarketHeaderProps) {
  console.log(onRefresh);
  const router = useRouter();
  const [marketData, setMarketData] = useState([
    { name: '나스닥', value: '17,251.32', change: '-4.0%', negative: true },
    { name: 'S&P 500', value: '4,112.55', change: '+2.1%', negative: false },
    { name: '다우존스', value: '33,921.73', change: '-1.2%', negative: true },
    { name: '코스피', value: '2,564.22', change: '+0.8%', negative: false },
    { name: '코스닥', value: '860.45', change: '-0.5%', negative: true },
  ]);
  const handleRouteSearch = () => {
    router.push('/search');
  };
  const handleRouteSetting = () => {
    router.push('/setting');
  };
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setMarketData((prev) => {
          const newData = [...prev];
          const firstItem = newData.shift();
          if (firstItem) newData.push(firstItem);
          return newData;
        });

        setIsAnimating(false);
      }, 2000); // 애니메이션 지속 시간 (0.5초)
    }, 6000); // 2초마다 롤링

    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <MarketInfoWrapper>
        <RollingContainer>
          <RollingList isAnimating={isAnimating}>
            {marketData.map((item, index) => (
              <RollingItem key={index}>
                <span>{item.name}</span>
                <MarketValue negative={item.negative}>{item.value}</MarketValue>
                <MarketChange negative={item.negative}>
                  {item.change}
                </MarketChange>
              </RollingItem>
            ))}
          </RollingList>
        </RollingContainer>
      </MarketInfoWrapper>
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
