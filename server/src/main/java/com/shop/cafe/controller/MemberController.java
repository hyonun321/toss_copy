package com.shop.cafe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.shop.cafe.dto.Member;
import com.shop.cafe.service.MemberService;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class MemberController {
    
    @Autowired
    private MemberService memberService;
    
    

	@PostMapping("insertMember")
	public Map<String, String> insertMember(@RequestBody  Member m) {
		System.out.println(m);
		Map<String,String> responseData=new HashMap();
		try {
			memberService.insertMember(m);
			responseData.put("msg","ok");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			responseData.put("nickname 이나 email이 중복됩니다.","ok");
		}
		
		return responseData;
	}
    
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        try {
            Member result = memberService.login(member);
            System.out.println(member);
            if (result == null) { // 로그인 실패: 회원이 없거나 비밀번호 불일치
                Map<String, String> response = new HashMap<>();
                response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            } else { // 로그인 성공
                Map<String, String> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("name", result.getNickname());
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "서버 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
