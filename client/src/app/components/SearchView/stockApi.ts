import axios from 'axios';

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
