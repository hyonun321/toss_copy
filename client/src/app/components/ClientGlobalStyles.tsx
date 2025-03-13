'use client';
import { Global } from '@emotion/react';
import { globalStyle } from '@/app/theme/global';

export function ClientGlobalStyles() {
  return <Global styles={globalStyle} />;
}
