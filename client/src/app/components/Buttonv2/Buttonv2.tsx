'use client';

import React from 'react';
import { StyledButtonv2 } from './Button2.style';
import { theme } from '@/app/theme/theme';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
};

export function Buttonv2({
  text,
  onClick,
  backgroundColor = 'red',
  textColor = 'white',
}: ButtonProps) {
  // 전달받은 문자열이 테마에 정의된 색상 키와 일치하면 해당 값을 사용
  const resolvedBackgroundColor =
    (theme.colors as Record<string, string>)[backgroundColor] ||
    backgroundColor;
  const resolvedTextColor =
    (theme.colors as Record<string, string>)[textColor] || textColor;

  return (
    <StyledButtonv2
      onClick={onClick}
      backgroundColor={resolvedBackgroundColor}
      textColor={resolvedTextColor}
    >
      {text}
    </StyledButtonv2>
  );
}
