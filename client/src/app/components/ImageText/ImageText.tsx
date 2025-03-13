'use client';
import { ReactNode } from 'react';
import { StyledText, Container, StyledImage } from './ImageText.style';
type ImageTextProps = {
  imageSrc?: string;
  alt?: string;
  text?: ReactNode;
};

export function ImageText({ imageSrc, alt, text }: ImageTextProps) {
  return (
    <Container>
      {imageSrc && <StyledImage src={imageSrc} alt={alt ?? ''} />}
      {text && <StyledText>{text}</StyledText>}
    </Container>
  );
}
