import React from 'react';
import styles from './InputField.module.css';

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
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${value ? styles.filled : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
      <label className={styles.label}>
        <span>{label}</span>
      </label>
    </div>
  );
};
