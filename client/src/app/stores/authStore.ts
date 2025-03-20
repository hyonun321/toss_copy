// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { isValidPassword } from '../utils/validation';

interface LoginResponse {
  status: string;
  nickname?: string;
  Authorization?: string;
  message?: string;
}
interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  nickname: string | null;
  token: string | null;

  // 액션들 (모든 인증 로직 통합)
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    nickname: string;
    pwd: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setAuth: (token: string, email: string, nickname: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<boolean>;
  changeNickname: (
    newNickname: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    data: PasswordChangeRequest,
  ) => Promise<{ success: boolean; error?: string }>;
}
const createCustomStorage = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: null,
      nickname: null,
      token: null,

      // 인증 정보 설정 (내부 헬퍼 함수)
      setAuth: (token, email, nickname) => {
        // Zustand 스토어 업데이트
        set({
          token,
          email,
          nickname,
          isAuthenticated: true,
        });
      },

      // 인증 정보 초기화 (내부 헬퍼 함수)
      clearAuth: () => {
        // Zustand 스토어 초기화
        set({
          token: null,
          email: null,
          nickname: null,
          isAuthenticated: false,
        });
      },

      // 로그인 로직
      login: async (email, password) => {
        try {
          const response = await fetch('http://localhost:8080/tokenLogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              pwd: password,
            }),
          });

          const data: LoginResponse = await response.json();

          if (
            data.status === 'success' &&
            data.Authorization &&
            data.nickname
          ) {
            sessionStorage.setItem('email', email);
            get().setAuth(data.Authorization, email, data.nickname);
            return { success: true };
          } else {
            return {
              success: false,
              error: data.message || '로그인에 실패했습니다.',
            };
          }
        } catch (error) {
          console.error('로그인 오류:', error);
          return {
            success: false,
            error: '서버 연결에 실패했습니다.',
          };
        }
      },

      // 회원가입 로직
      signup: async (data) => {
        try {
          // 회원가입 요청
          const response = await fetch('http://localhost:8080/insertMember', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.text();

          if (result.includes('가입을 환영합니다')) {
            // 회원가입 성공 후 자동 로그인
            const loginResult = await get().login(data.email, data.pwd);
            return loginResult;
          } else {
            return {
              success: false,
              error: result || '회원가입에 실패했습니다.',
            };
          }
        } catch (error) {
          console.error('회원가입 오류:', error);
          return {
            success: false,
            error: '서버 연결에 실패했습니다.',
          };
        }
      },

      // 로그아웃 로직
      logout: async () => {
        const { token } = get();

        if (token) {
          try {
            await fetch('http://localhost:8080/logout', {
              method: 'POST',
              headers: {
                Authorization: token,
              },
            });
          } catch (error) {
            console.error('로그아웃 오류:', error);
          }
        }

        // 인증 정보 초기화
        get().clearAuth();
      },

      // 인증 상태 확인
      checkAuth: async () => {
        // 먼저 세션 스토리지와 동기화가 필요한지 확인
        if (typeof window !== 'undefined') {
          const { token, email, nickname } = get();

          if (!token || !email) {
            // 스토어 상태 업데이트 (이메일은 없으므로 null로 설정)
            set({
              token: token,
              nickname: nickname,
              isAuthenticated: true,
              // 이메일은 세션 스토리지에 저장되지 않아 복원할 수 없음
            });
          }
        }

        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          // 서버에 토큰 검증 요청
          const response = await fetch('http://localhost:8080/validateToken', {
            method: 'POST',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            get().clearAuth();
            return false;
          }

          const data = await response.json();
          const isValid = data.valid === true;

          set({ isAuthenticated: isValid });

          if (!isValid) {
            get().clearAuth();
          }

          return isValid;
        } catch (error) {
          console.error('인증 확인 실패:', error);
          set({ isAuthenticated: false });
          return false;
        }
      },

      changeNickname: async (newNickname: string) => {
        const { email, token } = get();

        if (!email || !token) {
          return {
            success: false,
            error: '로그인 상태에서만 닉네임을 변경할 수 있습니다.',
          };
        }

        try {
          // 서버에 닉네임 변경 요청
          const response = await fetch('http://localhost:8080/updateMember', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              email: email, // 식별자로 이메일 사용
              nickname: newNickname,
              // pwd는 빼고 요청 (비밀번호 변경이 아니므로)
            }),
          });

          if (!response.ok) {
            return {
              success: false,
              error: '서버 오류가 발생했습니다.',
            };
          }

          const result = await response.text();

          if (result === 'ok') {
            // 닉네임 변경 성공 - 로컬 상태 업데이트
            set({ nickname: newNickname });

            // sessionStorage도 업데이트 (기존 코드와의 호환성)
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('nickname', newNickname);
            }

            return { success: true };
          } else {
            return {
              success: false,
              error: result || '닉네임 변경에 실패했습니다.',
            };
          }
        } catch (error) {
          console.error('닉네임 변경 오류:', error);
          return {
            success: false,
            error: '서버 연결에 실패했습니다.',
          };
        }
      },
      changePassword: async (data: PasswordChangeRequest) => {
        const { email, token } = get();

        if (!email || !token) {
          return {
            success: false,
            error: '로그인 상태에서만 비밀번호를 변경할 수 있습니다.',
          };
        }
        // 비밀번호 유효성 검사
        if (!isValidPassword(data.newPassword)) {
          return {
            success: false,
            error:
              '비밀번호는 8자리 이상이어야 하며, 특수문자와 숫자를 포함해야 합니다.',
          };
        }

        try {
          // 서버에 비밀번호 변경 요청
          const response = await fetch('http://localhost:8080/changePassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              email: email,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            }),
          });

          const result = await response.text();

          if (result === 'ok') {
            // 비밀번호 변경 성공 - 토큰도 재발급될 수 있으므로 서버에서 응답을 받아야 함
            return { success: true };
          } else {
            return {
              success: false,
              error: result || '비밀번호 변경에 실패했습니다.',
            };
          }
        } catch (error) {
          console.error('비밀번호 변경 오류:', error);
          return {
            success: false,
            error: '서버 연결에 실패했습니다.',
          };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createCustomStorage()),
    },
  ),
);
