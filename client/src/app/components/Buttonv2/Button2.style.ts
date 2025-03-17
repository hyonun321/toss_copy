import styled from '@emotion/styled';

export const StyledButtonv2 = styled.button<{
  backgroundColor: string;
  textColor: string;
}>`
  display: block;
  height: 64px;
  width: 100%;
  border: none;
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ textColor }) => textColor};
  font-size: 1.25rem;
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
