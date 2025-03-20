'use client';

import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { theme } from '@/app/theme/theme';
import BottomSheet from '@/app/components/BottomSheet/BottomSheet';
import BottomSheetContent from '../BottomSheet/BottomSheetContent';
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
import { useAuthStore } from '@/app/stores/authStore';
type StockListItemProps = {
  rank: number;
  stockCode: string;
  stockName: string;
  price: string;
  changePercentage: string;
  isPositiveChange: boolean;
  change?: string;
  isFavorite?: boolean;
  refreshData?: () => void;
};

export function StockListItem({
  rank,
  stockCode,
  stockName,
  price,
  changePercentage,
  isPositiveChange,
  isFavorite,
  refreshData,
}: StockListItemProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { email } = useAuthStore();

  useEffect(() => {
    if (email) {
      fetch(
        `http://localhost:8080/api/likes/isLiked?email=${email}&stockCode=${stockCode}`,
      )
        .then((res) => res.json())
        .then((isLiked) => setFavorite(isLiked))
        .catch((err) => console.error('좋아요 상태 조회 실패:', err));
    }
  }, [stockCode, email]);
  const handleFavoriteClick = () => {
    if (!email) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsBottomSheetOpen(true);
  };

  const handleConfirmFavorite = async () => {
    try {
      const url = favorite
        ? 'http://localhost:8080/api/likes/remove'
        : 'http://localhost:8080/api/likes/add';

      let exchangeCode = 'KRX';
      if (stockCode.match(/[A-Z]/)) {
        exchangeCode = 'NAS'; // 기본 해외거래소는 나스닥으로 가정
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, stockCode, stockName, exchangeCode }),
      });

      if (response.ok) {
        setFavorite(!favorite);
        setIsBottomSheetOpen(false); // Close the bottom sheet after action
        if (refreshData) {
          refreshData();
        }
      } else {
        console.error('좋아요 변경 실패');
      }
    } catch (err) {
      console.error('좋아요 변경 중 오류 발생:', err);
    }
  };
  return (
    <>
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

      {isBottomSheetOpen && (
        <BottomSheet height="20vh">
          <BottomSheetContent
            title={
              <>
                {stockName}을(를)
                <br />
                {favorite
                  ? '관심종목에서 삭제하시겠습니까?'
                  : '관심종목에 등록하시겠습니까?'}
              </>
            }
            leftIcon="/images/cancel.png"
            leftButtonText="취소"
            rightButtonText={favorite ? '삭제' : '등록'}
            onClose={() => setIsBottomSheetOpen(false)}
            onLeftClick={() => setIsBottomSheetOpen(false)}
            onRightClick={handleConfirmFavorite}
          />
        </BottomSheet>
      )}
    </>
  );
}
