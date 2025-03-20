import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;
`;

export const InputContainer = styled.div`
  width: 100%;
  padding: 70px 32px;
  max-width: 400px;
`;

export const TitleContainer = styled.div`
  position: relative;
  padding: 45px;
`;

export const FixedButton = styled.div<{ resizeHeight: number }>`
  position: absolute;
  bottom: ${({ resizeHeight }) => `calc(16px + ${resizeHeight}px)`};
  width: 100%;
  background-color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  transition: bottom 0.3s ease-in-out;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;
