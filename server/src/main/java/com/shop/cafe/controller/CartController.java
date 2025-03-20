package com.shop.cafe.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.shop.cafe.dto.Cart;
import com.shop.cafe.dto.Login;
import com.shop.cafe.dto.Member;
import com.shop.cafe.service.CartService;
import com.shop.cafe.service.MemberService;
import com.shop.cafe.util.JwtTokenProvider;

@RestController
@CrossOrigin("http://127.0.0.1:3000/")
public class CartController {
	
	@Autowired
	MemberService memberService;
	
	@Autowired
	CartService cartService;
	
	@PostMapping("addToCart")
	public String addToCart(@RequestHeader String authorization, @RequestBody Cart cart) {
	    try {
//	        Login loginInfo = memberService.checkToken(authorization);
//	        
//	        if(loginInfo!=null && loginInfo.getLoginTime()!=null) {
//		        long now = System.currentTimeMillis(); // 현재 시간 (밀리초)
//		        //SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		        //sdf.setTimeZone(TimeZone.getTimeZone("UTC"));// 현재 시간을 UTC로 변환
//		        //String nowStr = sdf.format(new Date(now));
//		        //System.out.println("Now: " + nowStr);	        
//		        
//		        long lastRequestTime = loginInfo.getLoginTime().getTime(); // DB에서 가져온 로그인 시간	 
//		        
//		        long interval = now-lastRequestTime ; //now와 lastRequestTime 비교
//		        System.out.println("interval: " + interval);
//		        
//		        if(interval<=1800000) {//30분이 지나지 않았다면
//		        	cart.setEmail(loginInfo.getEmail());
//		        	cart.setQuantity(1);
//		        	cartService.addToCart(cart);
//		        	return "ok";
//		        }
//	        }


	    		    	
	    	if(JwtTokenProvider.validateToken(authorization)) { //로그인 시간이 유효한 지 확인
	    		Login loginInfo = memberService.checkToken(authorization);//email을 가져오기 위함
	    		cart.setEmail(loginInfo.getEmail());
	    		cart.setQuantity(1);
	    		cartService.addToCart(cart);
	        	return "ok";
	    	}
	        return null;
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	    
	   
	}
	
	

}
