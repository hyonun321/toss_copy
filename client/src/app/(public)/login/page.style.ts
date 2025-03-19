// app/login/page.style.ts
import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
`;

export const InputContainer = styled.div`
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FixedButtonContainer = styled.div<{ bottomOffset: number }>`
  position: fixed;
  left: 0;
  bottom: ${(props) => `calc(16px + ${props.bottomOffset}px)`};
  width: 100%;
  background-color: #fff;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: bottom 0.3s ease-in-out;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;
