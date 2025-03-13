package com.shop.cafe.dto;

import javax.xml.crypto.Data;

public class Member {
	private String email,pwd,nickname;
	private Data registDate;
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPwd() {
		return pwd;
	}

	public Member(String email, String pwd, String nickname) {
		super();
		this.email = email;
		this.pwd = pwd;
		this.nickname = nickname;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
}
