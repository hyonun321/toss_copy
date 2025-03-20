package com.shop.cafe.service;

import java.util.Date;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shop.cafe.dao.LoginDao;
import com.shop.cafe.dao.MemberDao;
import com.shop.cafe.dao.SaltDao;
import com.shop.cafe.dao.LoginAttemptDao;
import com.shop.cafe.dto.Login;
import com.shop.cafe.dto.Member;
import com.shop.cafe.dto.SaltInfo;
import com.shop.cafe.dto.LoginAttempt;
import com.shop.cafe.util.JwtTokenProvider;
import com.shop.cafe.util.OpenCrypt;

@Service
public class MemberService {
	@Autowired
	MemberDao memberDao;
	
	@Autowired
	LoginDao loginDao;
	
	@Autowired
	SaltDao saltDao;
	
	@Autowired
	LoginAttemptDao loginAttemptDao;
	
	private static final int MAX_FAILED_ATTEMPTS = 5;
	private static final long LOCK_TIME_DURATION = 5 * 60 * 1000; // 5분을 밀리초로 변환

	public Login checkToken(String authorization) throws Exception {
		// TODO Auto-generated method stub
		return loginDao.checkToken(authorization);
	}

	
	@Transactional
	public Login tokenLogin(Member m) throws Exception {
		String email = m.getEmail();
		

		try {
			// 로그인 시도 확인
			LoginAttempt attempt = loginAttemptDao.getLoginAttempt(email);
			if (attempt != null && attempt.isLocked()) {
				long lockTimeInMillis = attempt.getLastFailedAttempt().getTime() + LOCK_TIME_DURATION;
				if (System.currentTimeMillis() < lockTimeInMillis) {
					long remainingTime = (lockTimeInMillis - System.currentTimeMillis()) / 1000; // 초 단위로 변환
					throw new Exception(String.format("계정이 잠겼습니다. %.0f분 후에 다시 시도해주세요.", remainingTime/60.0));
				} else {
					// 잠금 시간이 지났으면 초기화
					loginAttemptDao.resetLoginAttempt(email);
				}
			}

			// 기존 로그인 로직
			SaltInfo saltInfo = saltDao.selectSalt(email);
			if (saltInfo == null) {
				throw new Exception("존재하지 않는 사용자입니다.");
			}

			String pwd = m.getPwd();
			byte[] pwdHash = OpenCrypt.getSHA256(pwd, saltInfo.getSalt());
			String pwdHashHex = OpenCrypt.byteArrayToHex(pwdHash);
			
			m.setPwd(pwdHashHex);
			m = memberDao.login(m);

			if (m != null && m.getNickname() != null && !m.getNickname().trim().equals("")) {
				// 로그인 성공 시 로그인 시도 초기화
				if (attempt != null) {
					loginAttemptDao.resetLoginAttempt(email);
				}
				
				String jwtToken = JwtTokenProvider.createToken(m.getNickname());
				Login loginInfo = new Login(email, jwtToken, m.getNickname(), new Date());
				loginDao.insertToken(loginInfo);
				return loginInfo;
			} else {
				// 로그인 실패 처리
				if (attempt == null) {
					attempt = new LoginAttempt(email, 1, new Date(), false);
					loginAttemptDao.insertLoginAttempt(attempt);
					throw new Exception(String.format("로그인 실패: 남은 시도 횟수 %d회", MAX_FAILED_ATTEMPTS - 1));
				} else {
					attempt.setFailCount(attempt.getFailCount() + 1);
					attempt.setLastFailedAttempt(new Date());
					
					if (attempt.getFailCount() >= MAX_FAILED_ATTEMPTS) {
						attempt.setLocked(true);
					}
					
					loginAttemptDao.updateLoginAttempt(attempt);
					
					if (attempt.isLocked()) {
						throw new Exception("로그인 5회 실패로 계정이 5분간 잠겼습니다.");
					} else {
						throw new Exception(String.format("로그인 실패: 남은 시도 횟수 %d회", MAX_FAILED_ATTEMPTS - attempt.getFailCount()));
					}
				}
			}
		} catch (Exception e) {
			throw e; // 트랜잭션 롤백을 위해 예외를 다시 던집니다
		}
	}
	
	public boolean validateToken(String token) {
	    try {
	        // Use the existing checkToken method from LoginDao
	        Login login = loginDao.checkToken(token);
	        return login != null;
	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	}
	public Member login(Member m) throws Exception {
		return memberDao.login(m);
	}
	
	@Transactional  // 이 어노테이션을 추가하면, 전체 회원가입 과정이 하나의 트랜잭션으로 처리됩니다.
	public void insertMember(Member m) throws Exception{
		
		// 이메일 유효성 검사
		String email=m.getEmail();
	    if (!isValidEmail(email)) {
	        throw new Exception("유효하지 않은 이메일 형식입니다.");
	    }		
		
		// 패스워드 유효성 검사
	    String pwd=m.getPwd();
	    if (!isValidPassword(pwd)) {
	        throw new Exception("패스워드는 8자리 이상이어야 하며, 특수문자와 숫자를 포함해야 합니다.");
	    }
	    
	    // 패스워드 암호화
		String salt=UUID.randomUUID().toString();
		byte[] originalHash=OpenCrypt.getSHA256(pwd, salt);
		String pwdHash=OpenCrypt.byteArrayToHex(originalHash);
	    
		m.setPwd(pwdHash);
		int count = memberDao.countByNickname(m.getNickname());
		    if (count > 0) {
		        throw new Exception("이미 존재하는 닉네임입니다.");
		    }
		saltDao.insertSalt(new SaltInfo(email, salt));
		memberDao.insertMember(m);
	}
	
	public void updateMember(Member m) throws Exception{
		memberDao.updateMember(m);
	}
	
//	public void deleteMember(String email) throws Exception{
//		memberDao.deleteMember(email);
//	}

	public void logout(String authorization) throws Exception {
		loginDao.deleteToken(authorization);
		
	}
	
	// 이메일 유효성 검사 메서드
	private boolean isValidEmail(String email) {
	    // 이메일 패턴
	    String emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
	    return Pattern.matches(emailPattern, email);
	}
	
	// 패스워드 유효성 검사 메서드
	private boolean isValidPassword(String password) {
	    // 패스워드 패턴: 8자리 이상, 숫자 포함, 특수문자 포함
	    String passwordPattern = "^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";
	    return Pattern.matches(passwordPattern, password);
	}
	
	@Transactional
	public boolean changePassword(String email, String currentPassword, String newPassword, String token) throws Exception {
	    // 1. 현재 비밀번호 확인 - tokenLogin 메서드의 로직을 활용
	    SaltInfo saltInfo = saltDao.selectSalt(email);
	    if (saltInfo == null) {
	        throw new Exception("사용자 정보를 찾을 수 없습니다.");
	    }
	    
	    // 현재 비밀번호 해시 생성
	    byte[] currentPwdHash = OpenCrypt.getSHA256(currentPassword, saltInfo.getSalt());
	    String currentPwdHashHex = OpenCrypt.byteArrayToHex(currentPwdHash);
	    
	    // 비밀번호 일치 여부 확인
	    Member tempMember = new Member(email, currentPwdHashHex, null);
	    Member member = memberDao.login(tempMember);
	    
	    if (member == null) {
	        return false; // 현재 비밀번호가 일치하지 않음
	    }
	    
	    // 2. 새 비밀번호 유효성 검사
	    if (!isValidPassword(newPassword)) {
	        throw new Exception("비밀번호는 8자리 이상이어야 하며, 특수문자와 숫자를 포함해야 합니다.");
	    }
	    
	    // 3. 새 salt 생성
	    String newSalt = UUID.randomUUID().toString();
	    
	    // 4. 새 비밀번호 해시
	    byte[] newPwdHash = OpenCrypt.getSHA256(newPassword, newSalt);
	    String newPwdHashHex = OpenCrypt.byteArrayToHex(newPwdHash);
	    
	    // 5. member 테이블 업데이트
	    Member updatedMember = new Member(email, newPwdHashHex, member.getNickname());
	    memberDao.updatePassword(updatedMember); // 이 메서드는 아직 존재하지 않음 - 아래에서 구현
	    
	    // 6. saltInfo 테이블 업데이트
	    saltDao.updateSalt(new SaltInfo(email, newSalt)); // 이 메서드는 아직 존재하지 않음 - 아래에서 구현
	    
	    return true;
	}
	

}
