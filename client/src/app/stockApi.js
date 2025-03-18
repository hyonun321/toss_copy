// services/stockApi.js
import axios from 'axios';

// API 기본 URL 설정 - 환경 변수 사용 권장
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 국내 주식 목록 조회
export const fetchDomesticStocks = async () => {
  try {
    const response = await apiClient.get('/stocks/domestic');
    return response.data;
  } catch (error) {
    console.error('국내 주식 데이터 조회 실패:', error);
    throw error;
  }
};

// 해외 주식 목록 조회
export const fetchOverseasStocks = async () => {
  try {
    const response = await apiClient.get('/stocks/overseas');
    return response.data;
  } catch (error) {
    console.error('해외 주식 데이터 조회 실패:', error);
    throw error;
  }
};
