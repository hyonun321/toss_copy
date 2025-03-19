import axios from 'axios';
import { BaseStock } from '@/app/types/stock';

const API_BASE_URL = 'http://localhost:8080/api';

interface elasticStockProps {
  id: string;
  symbol: string;
  name: string;
  market: string;
}
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
export const searchStocks = async (query: string): Promise<BaseStock[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/search/stocks?query=${encodeURIComponent(query)}`,
    );
    console.log(response);

    // 엘라스틱서치 결과를 BaseStock 형태로 변환
    return response.data.map((item: elasticStockProps) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      // country 필드 설정: nasdaq이면 'us', 아니면 'kr'
      country: item.market?.toLowerCase() === 'nasdaq' ? 'us' : 'kr',
      // BaseStock 인터페이스에 필요한 나머지 필드들
      price: 0, // 기본값, 실제 데이터가 있으면 대체
      change: 0, // 기본값
      changePercent: 0, // 기본값
      isPositive: false, // 기본값
      logoType: 'normal', // 기본 로고 타입
      // description 필드는 요청대로 제외
    }));
  } catch (error) {
    console.error('검색 실패:', error);
    return [];
  }
};
