'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Option.module.css';

interface OptionProps {
  iconSrc: string;
  label: string;
  hasToggle?: boolean;
  onClick?: () => void;
  onToggleChange?: (isActive: boolean) => void;
}

export const Option = ({
  iconSrc,
  label,
  hasToggle,
  onClick,
  onToggleChange,
}: OptionProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggleChange?.(newState);
  };

  return (
    <div className={styles.optionContainer}>
      <div className={styles.optionContent} onClick={onClick}>
        <Image
          className={styles.icon}
          width={24}
          height={24}
          alt={label}
          src={iconSrc}
        />
        <div className={styles.label}>{label}</div>
      </div>
      {hasToggle ? (
        <div
          className={`${styles.toggle} ${isActive ? styles.active : ''}`}
          onClick={handleToggle}
        >
          <div className={styles.knob} />
        </div>
      ) : (
        <Image
          className={styles.chevronIcon}
          width={24}
          height={24}
          alt="Arrow"
          src="/images/chevron-right.png"
          onClick={onClick}
        />
      )}
    </div>
  );
};
