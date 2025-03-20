'use client';

import {
  UserInfoContainer,
  AvatarIcon,
  UserInfoText,
  Username,
  Email,
} from './styles';

interface UserInfoProps {
  username: string | null;
  email: string | null;
}

export const UserInfo = ({ username, email }: UserInfoProps) => {
  return (
    <UserInfoContainer>
      <AvatarIcon
        width={64}
        height={64}
        alt="User Avatar"
        src="/images/Avatars.png"
      />
      <UserInfoText>
        <Username>{username}</Username>
        <Email>{email}</Email>
      </UserInfoText>
    </UserInfoContainer>
  );
};
