'use client';

import React from 'react';
import Image from 'next/image';
import styles from './AuthHeader.module.css';

export type AuthHeaderProps = {
  title?: string;
  onActionClick?: () => void;
};

export function AuthHeader({ title, onActionClick }: AuthHeaderProps) {
  return (
    <div className={styles.header}>
      <Image
        className={styles.backButton}
        width={24}
        height={24}
        alt="Action Button"
        src="/images/Left_Actionable.png"
        onClick={onActionClick}
        style={{ cursor: 'pointer' }}
      />
      <div className={styles.label}>{title}</div>
    </div>
  );
}
