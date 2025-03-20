import styled from '@emotion/styled';
import Image from 'next/image';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
`;

export const BackButton = styled(Image)`
  position: absolute;
  left: 20px;
  cursor: pointer;
`;

export const Label = styled.div`
  font-size: 20px;
`;
