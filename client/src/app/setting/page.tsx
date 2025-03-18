'use client';

import { useRouter } from 'next/router';
import { TopBar } from '@/app/components/SettingTopbar/TopBar';
import { UserInfo } from '@/app/components/UserInfo/UserInfo';
import { Option } from '@/app/components/Option/Option';
import styles from './page.module.css';

const SettingPage = () => {
  const router = useRouter();

  return (
    <div className={styles.settingPage}>
      <TopBar />
      <UserInfo username="{유저닉네임}" email="test@doss.ui" />
      <div className={styles.divider} />
      <div className={styles.content}>
        <Option
          iconSrc="/images/moon.png"
          label="다크 모드"
          hasToggle={true}
          onToggleChange={() => console.log('다크모드')}
        />
        <Option
          iconSrc="/images/user.png"
          label="닉네임 변경"
          onClick={() => router.push('/password-change')}
        />
        <Option
          iconSrc="/images/lock.png"
          label="비밀번호 변경"
          onClick={() => router.push('/password-change')}
        />
        <Option
          iconSrc="/images/unlock.png"
          label="로그아웃"
          onClick={() => router.push('/password-change')}
        />
      </div>
    </div>
  );
};

export default SettingPage;
