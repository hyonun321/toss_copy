'use client';

import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { theme } from '@/app/theme/theme';
import {
  ItemContainer,
  RankContainer,
  Rank,
  StockMarker,
  StockName,
  StockCode,
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
  change: string;
  changePercentage: string;
  isPositiveChange: boolean;
  isFavorite?: boolean;
};

export function StockListItem({
  rank,
  stockCode,
  stockName,
  price,
  change,
  changePercentage,
  isPositiveChange,
  isFavorite = false,
}: StockListItemProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  return (
    <ItemContainer>
      <RankContainer>
        <Rank>{rank}</Rank>
        <StockMarker>{stockName[0]}</StockMarker>
      </RankContainer>
      <StockInfoContainer>
        <StockName>{stockName}</StockName>
        {/* <StockCode>{stockCode}</StockCode> */}
        <PriceContainer>
          <Price>{price}</Price>
          <ChangeText isPositive={isPositiveChange}>
            {changePercentage}
          </ChangeText>
        </PriceContainer>
      </StockInfoContainer>
      <FavoriteButton
        onClick={() => {
          setFavorite(!favorite);
        }}
      >
        {favorite ? (
          <FaHeart color={theme.colors.red} size={20} />
        ) : (
          <FaHeart color={theme.colors.gray} size={20} />
        )}
      </FavoriteButton>
    </ItemContainer>
  );
}
