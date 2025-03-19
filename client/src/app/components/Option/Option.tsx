// Option.tsx
'use client';

import { useState } from 'react';
import {
  OptionContainer,
  OptionContent,
  StyledIcon,
  Label,
  ToggleContainer,
  Knob,
  ChevronIcon,
} from './Option.style';

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
    if (onToggleChange) {
      onToggleChange(newState);
    }
  };

  return (
    <OptionContainer onClick={onClick}>
      <OptionContent>
        <StyledIcon width={24} height={24} alt={label} src={iconSrc} />
        <Label>{label}</Label>
      </OptionContent>

      {hasToggle ? (
        <ToggleContainer isActive={isActive} onClick={handleToggle}>
          <Knob isActive={isActive} />
        </ToggleContainer>
      ) : (
        <ChevronIcon
          width={24}
          height={24}
          alt="화살표"
          src="/images/chevron-right.png"
          onClick={onClick}
        />
      )}
    </OptionContainer>
  );
};
