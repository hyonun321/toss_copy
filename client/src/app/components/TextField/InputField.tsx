import React from 'react';
import { InputContainer, StyledInput, Label } from './styles';

interface InputFieldProps {
  type: 'email' | 'password' | 'text';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  label,
  value,
  onChange,
}) => {
  return (
    <InputContainer>
      <StyledInput
        className={value ? 'filled' : ''}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
      <Label>
        <span>{label}</span>
      </Label>
    </InputContainer>
  );
};
