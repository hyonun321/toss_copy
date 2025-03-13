'use client';
import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

type ResponsiveWrapperProps = {
  children: React.ReactNode;
};

export function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
  const { width } = useWindowSize();
  const MAX_WIDTH = 768; // TODO: 데이터 정리

  if (width > MAX_WIDTH) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>현재 화면은 앱처럼 동작하지 않습니다. 화면 크기를 줄여주세요.</p>
      </div>
    );
  }

  return <>{children}</>;
}
