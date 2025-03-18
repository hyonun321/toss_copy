// src/app/components/SearchResults/SearchResults.tsx
'use client';
import { BaseStock } from '@/app/types/stock';
import {
  SearchResultsContainer,
  SearchResultItem,
  StockLogo,
  StockInfo,
  StockSymbol,
  StockDescription,
  CountryFlag,
  LeverageTag,
  HighlightText,
  NoResultsMessage,
} from './SearchResults.style';

interface SearchResultsProps {
  results: BaseStock[];
  searchQuery: string;
  onStockSelect: (stock: BaseStock) => void;
}

export function SearchResults({
  results,
  searchQuery,
  onStockSelect,
}: SearchResultsProps) {
  console.log(searchQuery);
  const highlightMatch = (text: string) => {
    console.log(text, '테스트');
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <HighlightText key={i}>{part}</HighlightText>
      ) : (
        part
      ),
    );
  };

  if (results.length === 0) {
    return (
      <SearchResultsContainer>
        <NoResultsMessage>검색 결과가 없습니다</NoResultsMessage>
      </SearchResultsContainer>
    );
  }

  return (
    <SearchResultsContainer>
      {results.map((stock) => (
        <SearchResultItem key={stock.id} onClick={() => onStockSelect(stock)}>
          <StockLogo logoType={stock.logoType || 'normal'}>
            {stock.leverage && <LeverageTag>{stock.leverage}</LeverageTag>}
            {stock.country === 'us' && <CountryFlag>🇺🇸</CountryFlag>}
          </StockLogo>
          <StockInfo>
            <StockSymbol>{stock.symbol}</StockSymbol>

            {/* 조건부 로직 수정 */}
            {stock.description ? (
              <StockDescription>
                {highlightMatch(stock.description)}
              </StockDescription>
            ) : (
              <StockDescription>{highlightMatch(stock.name)}</StockDescription>
            )}
          </StockInfo>
        </SearchResultItem>
      ))}
    </SearchResultsContainer>
  );
}
