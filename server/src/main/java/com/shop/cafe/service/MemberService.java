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
import com.shop.cafe.dto.Login;
import com.shop.cafe.dto.Member;
import com.shop.cafe.dto.SaltInfo;
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
	
	public Login checkToken(String authorization) throws Exception {
		// TODO Auto-generated method stub
		return loginDao.checkToken(authorization);
	}

	
	public Login tokenLogin(Member m) throws Exception {
		String email=m.getEmail();
		//email로 salt를 찾아옴
		SaltInfo saltInfo=saltDao.selectSalt(email);
		//pwd에 salt를 더하여 암호화
		String pwd=m.getPwd();
		byte [] pwdHash=OpenCrypt.getSHA256(pwd, saltInfo.getSalt());
		String pwdHashHex=OpenCrypt.byteArrayToHex(pwdHash);
		
		m.setPwd(pwdHashHex);
		m=memberDao.login(m);		
		
		if(m!=null) {
			String nickname=m.getNickname();
			if(nickname!=null && !nickname.trim().equals("")) {
				//member table에서 email과 pwd가 확인된 상황 즉, login ok				
				
//				//1. salt를 생성한다
//				String salt=UUID.randomUUID().toString();
//				System.out.println("salt:"+salt);
//				//2. email을 hashing 한다
//				byte[] originalHash=OpenCrypt.getSHA256(email, salt);
//				//3. db에 저장하기 좋은 포맷으로 인코딩한다
//				String myToken=OpenCrypt.byteArrayToHex(originalHash);
//				System.out.println("myToken : "+myToken);
				// 표준 포맷 JWT 얻기
				String jwtToken=JwtTokenProvider.createToken(nickname);
				System.out.println("jwtToken : "+jwtToken);
				
				//4. login table에 token 저장
				Login loginInfo=new Login(email, jwtToken, nickname, new Date());
				loginDao.insertToken(loginInfo);
				return loginInfo;
			}
		}
		
		return null;		 
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
		System.out.println("salt:"+salt+pwd);
		byte[] originalHash=OpenCrypt.getSHA256(pwd, salt);
		System.out.println("originalHash:"+originalHash);
		String pwdHash=OpenCrypt.byteArrayToHex(originalHash);
		System.out.println("pwdHash : "+pwdHash);
	    
		m.setPwd(pwdHash);
		int nicknameCount = memberDao.countByNickname(m.getNickname());
		    if (nicknameCount > 0) {
		        throw new Exception("이미 존재하는 닉네임입니다.");
		    }
		int emailCount = memberDao.countByEmail(m.getEmail());
	    if (emailCount > 0) {
	        throw new Exception("이미 가입한 유저입니다.");
	    }
		saltDao.insertSalt(new SaltInfo(email, salt));
		memberDao.insertMember(m);
	}
	
	public void updateMember(Member m) throws Exception{
		memberDao.updateMember(m);
	}
	
	public void deleteMember(String email) throws Exception{
		memberDao.deleteMember(email);
	}

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

	

}
