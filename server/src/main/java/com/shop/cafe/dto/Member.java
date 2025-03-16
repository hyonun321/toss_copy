package com.shop.cafe.dto;
import java.util.Date;

public class Member {
	private String email,pwd,nickname;
	private Date registDate;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPwd() {
		return pwd;
	}
	
	public Date getRegistDate() {
		return registDate;
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
