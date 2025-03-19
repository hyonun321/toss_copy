import { useAuthStore } from '@/app/stores/authStore';

// 간단히 Zustand 스토어의 메서드를 재노출
export const login = async (email: string, password: string) => {
  return useAuthStore.getState().login(email, password);
};

export const logout = async () => {
  return useAuthStore.getState().logout();
};

// 기존 코드와의 호환성을 위한 isAuthenticated 함수
export const isAuthenticated = async (): Promise<boolean> => {
  return useAuthStore.getState().checkAuth();
};
