import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const FixedButton = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 16px;
  text-align: center;
`;
