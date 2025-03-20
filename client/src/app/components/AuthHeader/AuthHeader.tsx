'use client';

import React from 'react';
import { Header, BackButton, Label } from './styles';

export type AuthHeaderProps = {
  title?: string;
  onActionClick?: () => void;
};

export const AuthHeader = ({ title, onActionClick }: AuthHeaderProps) => {
  return (
    <Header>
      <BackButton
        width={24}
        height={24}
        alt="Action Button"
        src="/images/Left_Actionable.png"
        onClick={onActionClick}
      />
      <Label>{title}</Label>
    </Header>
  );
};
