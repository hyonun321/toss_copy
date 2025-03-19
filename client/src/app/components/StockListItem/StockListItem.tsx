'use client';

import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { theme } from '@/app/theme/theme';
import {
  ItemContainer,
  RankContainer,
  Rank,
  StockMarker,
  StockName,
  StockInfoContainer,
  Price,
  PriceContainer,
  ChangeText,
  FavoriteButton,
} from './StockListItem.style';

type StockListItemProps = {
  rank: number;
  stockCode: string;
  stockName: string;
  price: string;
  changePercentage: string;
  isPositiveChange: boolean;
  change?: string;
};

export function StockListItem({
  rank,
  stockCode,
  stockName,
  price,
  changePercentage,
  isPositiveChange,
}: StockListItemProps) {
  const [favorite, setFavorite] = useState(false);
  const email =
    typeof window !== 'undefined' ? sessionStorage.getItem('email') : null;

  useEffect(() => {
    if (email) {
      fetch(
        `http://localhost:8080/api/likes/isLiked?email=${email}&stockCode=${stockCode}`,
      )
        .then((res) => res.json())
        .then((isLiked) => setFavorite(isLiked))
        .catch((err) => console.error('좋아요 상태 조회 실패:', err));
    }
  }, [stockCode]);

  const handleFavoriteClick = async () => {
    if (!email) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const url = favorite
        ? 'http://localhost:8080/api/likes/remove'
        : 'http://localhost:8080/api/likes/add';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, stockCode }),
      });

      if (response.ok) {
        setFavorite(!favorite);
      } else {
        console.error('좋아요 변경 실패');
      }
    } catch (err) {
      console.error('좋아요 변경 중 오류 발생:', err);
    }
  };

  return (
    <ItemContainer>
      <RankContainer>
        <Rank>{rank}</Rank>
        <StockMarker>{stockName[0]}</StockMarker>
      </RankContainer>
      <StockInfoContainer>
        <StockName>{stockName}</StockName>
        <PriceContainer>
          <Price>{price}</Price>
          <ChangeText isPositive={isPositiveChange}>
            {changePercentage}
          </ChangeText>
        </PriceContainer>
      </StockInfoContainer>
      <FavoriteButton onClick={handleFavoriteClick}>
        {favorite ? (
          <FaHeart color={theme.colors.red} size={20} />
        ) : (
          <FaHeart color={theme.colors.gray} size={20} />
        )}
      </FavoriteButton>
    </ItemContainer>
  );
}
