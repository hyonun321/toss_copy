import { Endpoint } from '@/app/constants/tabMappings';
export interface PopularStockItem {
  id: number;
  rank: number;
  name: string;
  change: string;
  isPositive: boolean;
}

export interface StockData {
  code: string;
  name: string;
  price: number;
  change: string;
  changeRate: number;
  isPositiveChange?: boolean;
}

export interface TransformedStockItem {
  category?: string;
  rank: number;
  stockCode: string;
  stockName: string;
  price: string;
  change: string;
  changePercentage: string;
  isPositiveChange: boolean;
  isFavorite: boolean;
}

export interface ApiResponse {
  resultCode: string;
  stocks: StockData[];
}

export type CategoryDataType = {
  [key in Endpoint]: TransformedStockItem[];
};
