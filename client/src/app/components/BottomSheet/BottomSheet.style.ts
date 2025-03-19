import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 10;
`;

export const Sheet = styled.div<{ height: string }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.height};
  background-color: white;
  z-index: 20;
  border-radius: 12px 12px 0 0;
  animation: ${slideUp} 0.3s ease-out;
`;

export const Handle = styled.div`
  width: 40px;
  height: 6px;
  background: #ccc;
  border-radius: 3px;
  margin: 8px auto;
`;

export const Content = styled.div`
  padding: 16px;
  height: calc(100% - 20px);
  overflow-y: auto;
`;
