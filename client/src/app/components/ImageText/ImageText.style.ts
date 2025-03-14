import styled from '@emotion/styled';

export const Container = styled.div<{ animate: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  opacity: ${({ animate }) => (animate ? 1 : 0)};
  transform: ${({ animate }) =>
    animate ? 'translateY(0)' : 'translateY(20px)'};
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
`;

export const StyledImage = styled.img`
  width: 135px;
  height: auto;
  display: block;
`;

export const StyledText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
`;
