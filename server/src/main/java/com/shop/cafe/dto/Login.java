package com.shop.cafe.dto;

import java.util.Date;

public class Login {
	
	private String email, token, nickname;
	private Date loginTime;
	
	public Login(String email, String token, String nickname, Date loginTime) {
		super();
		this.email = email;
		this.token = token;
		this.nickname = nickname;
		this.loginTime = loginTime;
	}

	public Login() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public Date getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}

	@Override
	public String toString() {
		return "Login [email=" + email + ", token=" + token + ", nickname=" + nickname + ", loginTime=" + loginTime
				+ "]";
	}
	
	
	
	

}
