'use client';

import { AnimatePresence } from 'framer-motion';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { Container, Slide } from './styles';
import { useOnboarding } from '@/app/hooks/useOnboarding';

export const Onboarding = () => {
  const { step, currentStep } = useOnboarding();

  return (
    <Container>
      <AnimatePresence mode="wait">
        <Slide
          key={step}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <ImageText
            imageSrc={currentStep.imageSrc}
            text={currentStep.text}
            enableAnimation={false}
          />
        </Slide>
      </AnimatePresence>
    </Container>
  );
};

export default Onboarding;
