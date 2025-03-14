'use client';
import { ReactNode, useState, useRef } from 'react';
import { useImpressionRef } from '@toss/impression-area';
import { StyledText, Container, StyledImage } from './ImageText.style';

type ImageTextProps = {
  imageSrc?: string;
  alt?: string;
  text?: ReactNode;
  enableAnimation?: boolean;
};

export function ImageText({
  imageSrc,
  alt,
  text,
  enableAnimation = true,
}: ImageTextProps) {
  const [animate, setAnimate] = useState(enableAnimation ? false : true);

  const impressionRef = useImpressionRef({
    onImpressionStart: () => {
      if (enableAnimation) {
        setAnimate(true);
      }
    },
    areaThreshold: 1,
  });
  const dummyRef = useRef(null);

  const ref = enableAnimation ? impressionRef : dummyRef;

  return (
    <Container ref={ref} animate={animate}>
      {imageSrc && <StyledImage src={imageSrc} alt={alt ?? ''} />}
      {text && <StyledText>{text}</StyledText>}
    </Container>
  );
}
