// constants/tabMappings.ts
export const TAB_OPTIONS = ['거래대금', '거래량', '급상승', '급하락'] as const;
export type Endpoint =
  | 'domestic/trade-value'
  | 'domestic/volume'
  | 'domestic/rising'
  | 'domestic/falling'
  | string
  | 'overseas/trade-value'
  | 'overseas/volume'
  | 'overseas/rising'
  | 'overseas/falling';
export const TAB_TO_ENDPOINT = {
  거래대금: 'domestic/trade-value',
  거래량: 'domestic/volume',
  급상승: 'domestic/rising',
  급하락: 'domestic/falling',
} as const;

export const ENDPOINT_TO_TAB = {
  'domestic/trade-value': '거래대금',
  'domestic/volume': '거래량',
  'domestic/rising': '급상승',
  'domestic/falling': '급하락',
} as const;

export const ALL_ENDPOINTS = Object.values(TAB_TO_ENDPOINT);
