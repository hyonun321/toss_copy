import Image from 'next/image';
import styled from '@emotion/styled';
export const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
  height: 56px;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
`;

export const BackIcon = styled(Image)`
  cursor: pointer;
  left: 16px;
  margin-right: 32px;
`;

export const Title = styled.div`
  flex: 1;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
`;
