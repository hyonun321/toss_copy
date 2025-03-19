import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 60px; // For bottom navigation padding
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 32px 20px 16px;
`;

export const StockListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

export const LoadingIndicator = styled.div`
  margin-top: 96px;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

export const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #e53e3e;
  font-size: 16px;
  background-color: #fff5f5;
  border-radius: 8px;
  margin: 10px 16px;
`;
