import { useFunnel } from '@use-funnel/browser';

import type { email, nickname, password } from './context';

export function useMyFunnel() {
  return useFunnel<{
    email: email;
    nickname: nickname;
    password: password;
  }>({
    id: 'register',
    initial: {
      step: 'email',

      context: {
        email: '',
        nickname: '',
        password: '',
      },
    },
  });
}
