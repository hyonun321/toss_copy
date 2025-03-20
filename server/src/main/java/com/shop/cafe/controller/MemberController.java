package com.shop.cafe.controller;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import com.shop.cafe.dto.Login;
import com.shop.cafe.dto.Member;
import com.shop.cafe.dto.PasswordChangeRequest;
import com.shop.cafe.service.MemberService;
import com.shop.cafe.service.StockService;

import java.util.logging.Logger;

@RestController
@CrossOrigin({"http://127.0.0.1:3000/","http://127.0.0.1:5500/","http://localhost:3000"})
public class MemberController {
    private static final Logger logger = Logger.getLogger(MemberService.class.getName());
    
	@Autowired
	private MemberService memberService;
	
	@PostMapping("logout")
	public void logout(@RequestHeader String authorization) {
		try {
			memberService.logout(authorization);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@PostMapping("tokenLogin")
	public Map<String,String> tokenLogin(@RequestBody Member m) {
		
		Map<String,String> responseMap = new HashMap<>();
		
		try {
			Login loginInfo = memberService.tokenLogin(m);
			
			if(loginInfo != null && loginInfo.getNickname() != null && loginInfo.getToken() != null) {
				responseMap.put("nickname", loginInfo.getNickname());
				responseMap.put("Authorization", loginInfo.getToken());
				responseMap.put("status", "success");
			} else {
				responseMap.put("status", "error");
				responseMap.put("message", "로그인에 실패했습니다.");
			}
		} catch (Exception e) {
			responseMap.put("status", "error");
			responseMap.put("message", e.getMessage());  // 서비스에서 발생한 상세 에러 메시지를 전달
		}
		return responseMap;
	}
	
	@PostMapping("validateToken")
	public Map<String, Boolean> validateToken(@RequestHeader String authorization) {
	    Map<String, Boolean> response = new HashMap<>();
	    
	    try {
	        boolean isValid = memberService.validateToken(authorization);
	        logger.severe("유저 토큰 로그인 검증" +authorization);
	        response.put("valid", isValid);
	    } catch (Exception e) {
	        e.printStackTrace();
	        response.put("valid", false);
	    }
	    
	    return response;
	}
	
	@PostMapping("login")
	public Map<String,String> login(@RequestBody Member m) {
		
		Map<String,String> responseMap=new HashMap<>();
		
		try {
			m=memberService.login(m);
			if (m != null) {
	            String nickname = m.getNickname();
	            if (nickname != null && !nickname.trim().equals("")) {
	                responseMap.put("nickname", nickname);
	            } else {
	                responseMap.put("msg", "다시 로그인 해주세요");
	            }
			} else {
	            responseMap.put("msg", "다시 로그인 해주세요");
	        }
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			responseMap.put("msg", "다시 로그인 해주세요");
		}
		return responseMap;
	}
	
	@PostMapping("insertMember")
	public String insertMember(@RequestBody Member m) {
	    try {
	        memberService.insertMember(m);
	        return m.getNickname() + "님 가입을 환영합니다";
	    }  catch (Exception e) {
	        e.printStackTrace();
	        return e.getMessage();  // 서비스에서 발생한 예외 메시지를 그대로 반환
	    }
	}
	
	@PostMapping("updateMember")
	public String updateMember(@RequestBody Member m) {
		try {
			memberService.updateMember(m);
			return "ok";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "동일한 닉네임이 존재합니다.";
		}
	}
	
	@PostMapping("deleteMember")
	public String deleteMember(@RequestBody String email) {
		try {
			memberService.deleteMember(email);
			return "ok";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "email과 pwd 확인해 주세요";
		}
	}
	
	
	@PostMapping("changePassword")
	public String changePassword(@RequestBody Map<String, String> request, @RequestHeader String authorization) {
	    try {
	        String email = request.get("email");
	        String currentPassword = request.get("currentPassword");
	        String newPassword = request.get("newPassword");
	        
	        if (email == null || currentPassword == null || newPassword == null) {
	            return "필수 정보가 누락되었습니다.";
	        }
	        
	        boolean success = memberService.changePassword(email, currentPassword, newPassword, authorization);
	        
	        if (success) {
	            return "ok";
	        } else {
	            return "현재 비밀번호가 일치하지 않습니다.";
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return e.getMessage();
	    }
	}

}
