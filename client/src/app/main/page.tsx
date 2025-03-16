'use client';
import { Button } from '../components/Button/Button';
import { ViewContainer } from '../components/viewContainer/viewContainer';
import styles from './page.module.css';
import { ImageText } from '@/app/components/ImageText/ImageText';
export default function Main() {
  const testEmail = 'test1@test.com';
  const testPwd = 'testtest@2';
  const testNickname = 'test1';
  const handleSignup = async () => {
    try {
      // 서버 URL과 엔드포인트가 정확한지 확인해 (여기서는 http://localhost:8080/login 예시)
      const response = await fetch('http://localhost:8080/insertMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 테스트용 로그인 정보: 실제 값으로 바꿔서 사용하면 돼
        body: JSON.stringify({
          email: testEmail,
          pwd: testPwd,
          nickname: testNickname,
        }),
      });
      const data = await response.json();
      console.log('로그인 결과:', data);
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  async function fetchApprovalKey() {
    const response = await fetch('/api/getApprovalKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('approval_key:', data);
    return data.approval_key;
  }

  // 주식 데이터 요청 함수
  async function fetchStockData() {
    try {
      const token = await fetchApprovalKey();
      const response = await fetch('/api/getStockData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `주식 데이터 요청 실패: ${response.status} ${errorText}`,
        );
      }
      const data = await response.json();
      console.log('주식 데이터:', data);
    } catch (error) {
      console.error('fetchStockData 오류:', error);
    }
  }

  const handleLogin = async () => {
    try {
      // 서버 URL과 엔드포인트가 정확한지 확인해 (여기서는 http://localhost:8080/login 예시)
      const response = await fetch('http://localhost:8080/tokenLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 테스트용 로그인 정보: 실제 값으로 바꿔서 사용하면 돼
        body: JSON.stringify({
          email: testEmail,
          pwd: testPwd,
        }),
      });
      const data = await response.json();
      console.log('로그인 결과:', data);
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <ViewContainer>
          <ImageText
            imageSrc="/images/doss_logo.png"
            enableAnimation={true}
            alt="도스 로고"
            text={
              <>
                주식의 모든 것
                <br />
                도스에서 간편하게
              </>
            }
          />
        </ViewContainer>
        <ViewContainer>
          <ImageText
            imageSrc="/images/storage.png"
            alt="도스 금고"
            enableAnimation={true}
            text={
              <>
                보고 싶은 주식을
                <br />
                마음 껏 담으세요
              </>
            }
          />
        </ViewContainer>
        <ViewContainer>
          <ImageText
            imageSrc="/images/wallet.png"
            alt="도스 지갑"
            enableAnimation={true}
            text={
              <>
                복잡한 검색 없이
                <br />
                내주식을 확인해요
              </>
            }
          />
        </ViewContainer>
      </div>

      {/* TODO: Footer로 속성을 넣어서 정리가능 */}
      <div className={styles.fixedButton}>
        <p>
          회원가입, 로그인 정보 <br></br>
          {testEmail}
          <br></br> pwd:{testPwd}
          <br></br> nickname: {testNickname}
        </p>
        <Button
          text="회원가입"
          onClick={handleSignup}
          backgroundColor="red"
          textColor="white"
        />
        <div style={{ height: '15px' }}></div>
        <Button
          text="로그인"
          onClick={handleLogin}
          backgroundColor="red"
          textColor="white"
        />
        <Button
          text="주식정보받기"
          onClick={fetchStockData}
          backgroundColor="red"
          textColor="white"
        />
      </div>
    </div>
  );
}
