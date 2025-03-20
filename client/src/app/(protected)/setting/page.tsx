'use client';

import { TopBar } from '@/app/components/SettingTopbar/TopBar';
import { UserInfo } from '@/app/components/UserInfo/UserInfo';
import { Option } from '@/app/components/Option/Option';
import BottomSheet from '@/app/components/BottomSheet/BottomSheet';
import BottomSheetContent from '@/app/components/BottomSheet/BottomSheetContent';
import { SettingPageContainer, Content, Divider } from './styles';
import { useSetting } from '@/app/hooks/useSetting';

export const SettingPage = () => {
  const {
    isOpen,
    nickname,
    email,
    handleLogout,
    handleClose,
    handleConfirmLogout,
    handleNicknameChange,
    handlePasswordChange,
  } = useSetting();

  return (
    <SettingPageContainer>
      <TopBar />
      <UserInfo username={nickname} email={email} />
      <Divider />
      <Content>
        <Option
          iconSrc="/images/moon.png"
          label="다크 모드"
          hasToggle
          //onToggleChange={() => console.log('다크모드')}
        /> */}
        <Option
          iconSrc="/images/user.png"
          label="닉네임 변경"
          onClick={handleNicknameChange}
        />
        <Option
          iconSrc="/images/lock.png"
          label="비밀번호 변경"
          onClick={handlePasswordChange}
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
              onClose={handleClose}
              onLeftClick={handleClose}
              onRightClick={handleConfirmLogout}
            />
          </BottomSheet>
        )}
      </Content>
    </SettingPageContainer>
  );
};

export default SettingPage;
