// src/app/components/SearchResults/SearchResults.tsx
'use client';
import { BaseStock } from '@/app/types/stock';
import {
  SearchResultsContainer,
  SearchResultItem,
  StockLogo,
  StockInfo,
  StockSymbol,
  CountryFlag,
  LeverageTag,
  HighlightText,
  NoResultsMessage,
} from './SearchResults.style';
import { StockName } from '../PopularStocks/PopularStocks.style';

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
  const highlightMatch = (text: string) => {
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
          <StockLogo logoType={stock.country || 'kr'}>
            {stock.leverage && <LeverageTag>{stock.leverage}</LeverageTag>}
            {stock.name[0]}
            <CountryFlag>{stock.country}</CountryFlag>
          </StockLogo>
          <StockInfo>
            <StockName>{highlightMatch(stock.name)}</StockName>
            <StockSymbol>{stock.symbol}</StockSymbol>
          </StockInfo>
        </SearchResultItem>
      ))}
    </SearchResultsContainer>
  );
}
