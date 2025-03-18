import axios from 'axios';
import { BaseStock } from '@/app/types/stock';

const API_BASE_URL = 'http://localhost:8080/api';
// TODO: 추후 리팩토링
export const fetchPopularStocks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/popular`);
    return response.data.stocks;
  } catch (error) {
    console.error('인기 주식 조회 실패:', error);
    throw error;
  }
};
// api/stockApi.ts 수정
export const searchStocks = async (query: string): Promise<BaseStock[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/search/stocks?query=${encodeURIComponent(query)}`,
    );
    console.log(response);

    // 엘라스틱서치 결과를 BaseStock 형태로 변환
    return response.data.map((item: any) => ({
      id: item.code,
      symbol: item.code,
      name: item.name,
      price: item.price.toString(),
      // 기타 필요한 필드 변환
    }));
  } catch (error) {
    console.error('검색 실패:', error);
    return [];
  }
};
