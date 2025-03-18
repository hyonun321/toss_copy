'use client';
import { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import {
  SearchBarContainer,
  SearchInput,
  SearchIcon,
  SearchInputContainer,
  BackButton,
  ClearButton,
} from './SearchBar.style';
import { useRouter } from 'next/navigation';
import { theme } from '@/app/theme/theme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onBack?: () => void;
  placeholder?: string;
  onQueryChange?: (query: string) => void; // 새로운 prop 추가
}

export function SearchBar({
  onSearch,
  onBack,
  placeholder = 'LG유플러스를 검색하세요',
  onQueryChange,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // 검색어 지울 때 상위 컴포넌트에 알림
    if (onQueryChange) {
      onQueryChange('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // 입력 변경 시 상위 컴포넌트에 알림
    if (onQueryChange) {
      onQueryChange(newQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRouteBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/home');
    }
  };

  return (
    <SearchBarContainer>
      <BackButton onClick={handleRouteBack}>
        <FiArrowLeft size={20} />
      </BackButton>
      <SearchInputContainer>
        <SearchIcon>
          <FiSearch size={16} color={theme.colors.boldGray} />
        </SearchIcon>
        <SearchInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <FiX size={16} color={theme.colors.boldGray} />
          </ClearButton>
        )}
      </SearchInputContainer>
    </SearchBarContainer>
  );
}
