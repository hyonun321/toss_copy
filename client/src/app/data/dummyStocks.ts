// src/app/data/dummyStocks.ts
import { BaseStock } from '../types/stock';

export const dummyStocks: BaseStock[] = [
  {
    id: '1',
    symbol: 'TSLL',
    name: 'TSLL',
    description: '디렉시온 테슬라 2배 ETF',
    logoType: 'tesla',
    country: 'us',
    leverage: '2x',
    changePercent: 3.7,
    change: '+3.7%',
    isPositive: true,
    rank: 1,
  },
  {
    id: '2',
    symbol: '테슬라',
    name: '테슬라',
    logoType: 'tesla',
    country: 'us',
    changePercent: 7.3,
    change: '+7.3%',
    isPositive: true,
    rank: 2,
  },
  {
    id: '3',
    symbol: 'NVDA',
    name: '엔비디아',
    logoType: 'normal',
    country: 'us',
    changePercent: -1.9,
    change: '-1.9%',
    isPositive: false,
    rank: 3,
  },
  {
    id: '4',
    symbol: 'ETHU',
    name: 'ETHU',
    logoType: 'normal',
    country: 'us',
    changePercent: 0.7,
    change: '+0.7%',
    isPositive: true,
    rank: 4,
  },
  {
    id: '5',
    symbol: 'TSLQ',
    name: 'TSLQ',
    description: 'TRADR 테슬라 2배 인버스 ETF',
    logoType: 'inverse',
    country: 'us',
    leverage: '2x',
    changePercent: 2.3,
    change: '+2.3%',
    isPositive: true,
    rank: 5,
  },
  // 추가 주식들...
  {
    id: '6',
    symbol: 'ACE 테슬라밸류체인액티브',
    name: 'ACE 테슬라밸류체인액티브',
    logoType: 'etf',
    changePercent: 5.1,
    change: '+5.1%',
    isPositive: true,
  },
  {
    id: '7',
    symbol: 'TIGER 테슬라채권혼합Fn',
    name: 'TIGER 테슬라채권혼합Fn',
    logoType: 'etf',
    changePercent: 3.2,
    change: '+3.2%',
    isPositive: true,
  },
  {
    id: '8',
    symbol: 'KODEX 테슬라커버드콜채권혼합액티브',
    name: 'KODEX 테슬라커버드콜채권혼합액티브',
    logoType: 'kodex',
    changePercent: 1.4,
    change: '+1.4%',
    isPositive: true,
  },
];
