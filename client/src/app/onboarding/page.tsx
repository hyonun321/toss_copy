'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageText } from '@/app/components/ImageText/ImageText';
import styles from './page.module.css';

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

  const handleRoute = () => {
    router.push('/main');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length - 1) {
          clearInterval(interval); // 마지막 단계에서 인터벌 멈춤
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
  }, [step]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={styles.slide}
        >
          <ImageText
            imageSrc={steps[step].imageSrc}
            text={steps[step].text}
            enableAnimation={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
