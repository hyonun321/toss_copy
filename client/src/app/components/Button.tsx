import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
