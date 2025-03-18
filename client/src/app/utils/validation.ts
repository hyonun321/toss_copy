/**
 * 이메일 유효성 검증 함수
 * Java 백엔드와 동일한 정규식 패턴 사용
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

/**
 * 이메일 유효성 검증 오류 메시지 반환
 */
export const getEmailErrorMessage = (email: string): string => {
  if (!email.trim()) {
    return '이메일을 입력해 주세요.';
  }
  if (!isValidEmail(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }
  return '';
};

/**
 * 닉네임 유효성 검증 함수
 * 2-10자의 한글, 영문, 숫자 허용
 */
export const isValidNickname = (nickname: string): boolean => {
  const nicknamePattern = /^[a-zA-Z0-9가-힣]{2,10}$/;
  return nicknamePattern.test(nickname);
};

/**
 * 닉네임 유효성 검증 오류 메시지 반환
 */
export const getNicknameErrorMessage = (nickname: string): string => {
  if (!nickname.trim()) {
    return '닉네임을 입력해 주세요.';
  }
  if (!isValidNickname(nickname)) {
    return '닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.';
  }
  return '';
};

/**
 * 비밀번호 유효성 검증 함수
 * 8-16자의 영문, 숫자, 특수문자 포함 필요
 */
export const isValidPassword = (password: string): boolean => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return passwordPattern.test(password);
};

/**
 * 비밀번호 유효성 검증 오류 메시지 반환
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (!password) {
    return '비밀번호를 입력해 주세요.';
  }
  if (!isValidPassword(password)) {
    return '비밀번호는 8~16자의 영문, 숫자, 특수문자를 포함해야 합니다.';
  }
  return '';
};

/**
 * 입력값 유효성 검증 (타입에 따라 적절한 검증 함수 호출)
 */
export const validateInput = (
  value: string,
  type: 'email' | 'nickname' | 'password',
): string => {
  switch (type) {
    case 'email':
      return getEmailErrorMessage(value);
    case 'nickname':
      return getNicknameErrorMessage(value);
    case 'password':
      return getPasswordErrorMessage(value);
    default:
      return '';
  }
};
