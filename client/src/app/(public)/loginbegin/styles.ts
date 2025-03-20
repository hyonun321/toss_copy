import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: #fff;
  padding: 0 16px;
`;

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding-left: 16px;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
`;
