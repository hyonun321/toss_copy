import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

export const useSetting = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { nickname, email, logout } = useAuthStore();

  const handleLogout = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    router.push('/');
  };

  const handleNicknameChange = () => {
    router.push('/nickname');
  };

  const handlePasswordChange = () => {
    router.push('/password');
  };

  return {
    isOpen,
    nickname,
    email,
    handleLogout,
    handleClose,
    handleConfirmLogout,
    handleNicknameChange,
    handlePasswordChange,
  };
};
