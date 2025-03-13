import styled from '@emotion/styled';

export const StyledButton = styled.button<{
  backgroundColor: string;
  textColor: string;
}>`
  display: inline-block;
  height: 64px;
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ textColor }) => textColor};
  font-size: 20px;
  font-weight: 500;
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.97);
    filter: brightness(0.8);
  }
`;
