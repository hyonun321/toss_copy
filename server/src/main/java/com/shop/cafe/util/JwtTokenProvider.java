package com.shop.cafe.util;

import java.util.Base64;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtTokenProvider {
	private static String salt = Base64.getEncoder().encodeToString("솔트".getBytes());

	public static String createToken(String data) {
		Claims claims = Jwts.claims();
		claims.put("nickname", data);

		Date now = new Date();
		System.out.println(now);

		return Jwts.builder().setHeaderParam(Header.TYPE, Header.JWT_TYPE).setClaims(claims).setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + (1000L * 60 * 30))).signWith(SignatureAlgorithm.HS256, salt)
				.compact();
	}

	public static boolean validateToken(String jwtToken) {
	    return !getInformation(jwtToken).getExpiration().before(new Date());//만료시간이 지났으면 true임. 그러므로 !을 붙여야함
	}


	public static Claims getInformation(String jwtToken) {
		return Jwts.parser().setSigningKey(salt).parseClaimsJws(jwtToken).getBody();
	}

}