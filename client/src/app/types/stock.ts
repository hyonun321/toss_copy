// src/app/types/stock.ts

// 모든 주식 데이터의 기본 인터페이스
export interface BaseStock {
  // 식별자
  id: string | number;
  symbol: string; // 주식 코드/심볼

  // 기본 정보
  name: string; // 주식 이름
  price?: number | string; // 현재 가격

  // 변동 데이터
  change?: string; // 변동량 ("+1.5")
  changePercent?: number; // 변동 퍼센트 (1.5)
  isPositive?: boolean; // 상승/하락 여부

  // 표시 속성
  rank?: number; // 순위
  logoType?: 'tesla' | 'etf' | 'kodex' | 'inverse' | 'normal' | string;
  // 추가 메타데이터
  country?: 'us' | 'kr' | string;
  leverage?: string; // 레버리지 ETF 표시용
  description?: string;
  isFavorite?: boolean; // 즐겨찾기 여부
}

// 검색 결과에 특화된 인터페이스
// export interface SearchStock extends BaseStock {
//   // 검색 결과에 필요한 추가 필드
// }

// 인기 주식 목록에 특화된 인터페이스
export interface PopularStock extends BaseStock {
  rank: number; // 인기 주식은 반드시 순위 필요
}

// API 응답에서 변환된 상세 주식 데이터
export interface DetailedStock extends BaseStock {
  price: number | string; // 상세 보기에서는 필수
  changeRate?: number;
}

// API 응답 타입
export interface StockApiResponse {
  resultCode: string;
  code: string;
  name: string;
  price: number;
  change: string;
  changeRate: number;
  exchangeCode: string;
  lastUpdated: string;
  positiveChange: boolean;
  rank: number;
  volume: string;
}
