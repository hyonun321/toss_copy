'use client';

import { Title } from '@/app/components/Title/Title';
import { ImageText } from '@/app/components/ImageText/ImageText';
import { Button } from '@/app/components/Button/Button';
import { AuthHeader } from '@/app/components/AuthHeader/AuthHeader';
import { useRouter } from 'next/navigation';
import { Container, Main, Footer } from './styles';

export const Home = () => {
  const router = useRouter();
  const handleRouteBack = () => {
    router.push('/main');
  };

  return (
    <Container>
      <AuthHeader onActionClick={handleRouteBack} />
      <Main>
        <Title>
          도스를 시작하려면
          <br />
          로그인 해주세요
        </Title>
        <ImageText
          imageSrc="/images/doss_logo.png"
          enableAnimation={true}
          alt="도스 로고"
        />
      </Main>

      <Footer>
        <Button
          text="로그인"
          onClick={() => router.push('/login')}
          backgroundColor="red"
          textColor="white"
        />
      </Footer>
    </Container>
  );
};

export default Home;
