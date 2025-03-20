import styled from '@emotion/styled';
import Image from 'next/image';

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

export const AvatarIcon = styled(Image)`
  border-radius: 50%;
`;

export const UserInfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Username = styled.b`
  font-weight: bold;
`;

export const Email = styled.div`
  font-size: 14px;
  color: #666;
`;
