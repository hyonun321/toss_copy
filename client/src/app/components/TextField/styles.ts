import styled from '@emotion/styled';

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  margin-bottom: 20px;
`;

export const StyledInput = styled.input<{ filled?: boolean }>`
  box-sizing: border-box;
  padding: 20px 0 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  color: #72777a;
  background: none;

  &.filled + label span {
    transform: translateY(-150%);
    font-size: 12px;
  }

  &:focus + label {
    border-bottom-color: #3182f6;
  }

  &:focus + label span {
    color: #3182f6;
  }

  &:not(:focus) + label {
    border-bottom-color: #e3e5e5;
  }

  &:not(:focus) + label span {
    color: #72777a;
  }

  &:focus + label::after,
  &.filled + label::after {
    width: 100%;
  }

  &:not(:focus) + label::after {
    width: 0;
  }
`;

export const Label = styled.label`
  font-size: 20px;
  position: absolute;
  left: 0;
  top: 5px;
  width: 100%;
  height: 100%;
  border-bottom: 1.5px solid #e3e5e5;
  pointer-events: none;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 0;
    height: 100%;
    border-bottom: 1.5px solid #3182f6;
    transition: width 0.3s ease;
  }

  span {
    color: #72777a;
    font-size: 20px;
    position: absolute;
    left: 0;
    bottom: 5px;
    transition:
      transform 0.3s ease,
      font-size 0.3s ease;
  }
`;
