'use client';

import React from 'react';
import {
  ToggleContainer,
  ToggleOption,
  ToggleSlider,
} from './MarketToggle.style';

export type Market = 'domestic' | 'overseas';

interface MarketToggleProps {
  selectedMarket: Market;
  onMarketChange: (market: Market) => void;
}

export function MarketToggle({
  selectedMarket,
  onMarketChange,
}: MarketToggleProps) {
  return (
    <ToggleContainer>
      <ToggleOption
        isActive={selectedMarket === 'domestic'}
        onClick={() => onMarketChange('domestic')}
      >
        국내
      </ToggleOption>
      <ToggleOption
        isActive={selectedMarket === 'overseas'}
        onClick={() => onMarketChange('overseas')}
      >
        미국
      </ToggleOption>
      <ToggleSlider
        position={selectedMarket === 'domestic' ? 'left' : 'right'}
      />
    </ToggleContainer>
  );
}
