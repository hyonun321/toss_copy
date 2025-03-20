'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { Container, Slide } from './styles';

const steps = [
  {
    imageSrc: '/images/doss_logo.png',
    text: (
      <>
        도스 계정을 <br />
        만들고 있어요
      </>
    ),
  },
  {
    imageSrc: '/images/wallet.png',
    text: (
      <>
        로그인 후, <br />내 지갑에 담아둔 <br />
        관심 주식을 볼 수 있어요
      </>
    ),
  },
  {
    imageSrc: '/images/phone.png',
    text: (
      <>
        앱 설치 없이
        <br />
        모바일로 간편하게
        <br />
        확인해요
      </>
    ),
  },
  { imageSrc: '/images/smile.png', text: <>회원가입 완료!</> },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleRoute = useCallback(() => {
    router.push('/');
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length - 1) {
          clearInterval(interval);
        }
        return nextStep;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step === steps.length - 1) {
      const timeout = setTimeout(() => {
        handleRoute();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [step, handleRoute]);

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
            imageSrc={steps[step].imageSrc}
            text={steps[step].text}
            enableAnimation={false}
          />
        </Slide>
      </AnimatePresence>
    </Container>
  );
}
