'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/app/components/SettingTopbar/TopBar';
import { UserInfo } from '@/app/components/UserInfo/UserInfo';
import { Option } from '@/app/components/Option/Option';
import styles from './page.module.css';
import BottomSheet from '@/app/components/BottomSheet/BottomSheet';
import { useState } from 'react';
import BottomSheetContent from '@/app/components/BottomSheet/BottomSheetContent';
import { useAuthStore } from '@/app/stores/authStore';

const SettingPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { nickname, email, logout } = useAuthStore();
  const handleLogout = () => {
    setIsOpen(true);
  };
  return (
    <div className={styles.settingPage}>
      <TopBar />
      <UserInfo username={nickname} email={email} />
      <div className={styles.divider} />
      <div className={styles.content}>
        <Option
          iconSrc="/images/moon.png"
          label="다크 모드"
          hasToggle
          //onToggleChange={() => console.log('다크모드')}
        />
        <Option
          iconSrc="/images/user.png"
          label="닉네임 변경"
          onClick={() => router.push('/nickname')}
        />
        <Option
          iconSrc="/images/lock.png"
          label="비밀번호 변경"
          onClick={() => router.push('/password')}
        />
        <Option
          iconSrc="/images/unlock.png"
          label="로그아웃"
          onClick={handleLogout}
        />
        {isOpen && (
          <BottomSheet height="20vh">
            <BottomSheetContent
              title="로그아웃 하시겠습니까?"
              leftIcon="/images/cancel.png"
              leftButtonText="취소"
              rightButtonText="로그아웃"
              onClose={() => setIsOpen(false)}
              onLeftClick={() => setIsOpen(false)}
              onRightClick={() => {
                logout();
                router.push('/');
              }}
            />
          </BottomSheet>
        )}
      </div>
    </div>
  );
};

export default SettingPage;
