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
  MarketChangePercent,
} from './MarketHeader.style';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  changeRate: string;
  negative: boolean;
}
export function MarketHeader() {
  const router = useRouter();
  const [marketData, setMarketData] = useState<MarketIndex[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());

  const handleRouteSearch = () => {
    router.push('/search');
  };
  const handleRouteSetting = () => {
    router.push('/setting');
  };

  // 실제 지수 데이터 가져오기
  useEffect(() => {
    const fetchMarketIndices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/stocks/indices/all',
        );

        if (!response.ok) {
          throw new Error('지수 데이터를 불러오는데 실패했습니다');
        }

        const data = await response.json();
        console.log(data);
        if (data.resultCode === '0' && Array.isArray(data.indices)) {
          const formattedIndices = data.indices.map((index: MarketIndex) => ({
            name: index.name,
            value: formatValue(index.value),
            change: formatChangeWithSign(index.change, index.negative),
            changeRate: index.changeRate,
            negative: index.negative,
          }));

          setMarketData(formattedIndices);
        }
      } catch (error) {
        console.error('지수 데이터 로딩 오류:', error);
        // 에러 시 기존 데이터 유지
      } finally {
      }
    };

    fetchMarketIndices();

    // 5분마다 데이터 갱신
    const intervalId = setInterval(() => {
      setLastRefreshed(Date.now());
    }, 300000); // 5분마다 갱신

    return () => clearInterval(intervalId);
  }, [lastRefreshed]);

  // 숫자 포맷팅 함수
  const formatValue = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    return numericValue.toLocaleString();
  };

  const formatChangeWithSign = (change: string, isNegative: boolean) => {
    console.log(change);
    const numericChange = parseFloat(change.replace(/,/g, ''));
    // 부호 및 소수점 1자리로 포맷팅
    return isNegative
      ? `-${Math.abs(numericChange).toFixed(1)}`
      : `+${Math.abs(numericChange).toFixed(1)}`;
  };

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
                <MarketChangePercent negative={item.negative}>
                  ({item.changeRate}%)
                </MarketChangePercent>
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
