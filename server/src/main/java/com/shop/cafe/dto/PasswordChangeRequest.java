package com.shop.cafe.dto;

public class PasswordChangeRequest {
    private String email;           // 사용자 식별용 이메일
    private String currentPassword; // 현재 비밀번호
    private String newPassword;     // 새 비밀번호
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCurrentPassword() {
		return currentPassword;
	}
	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	public PasswordChangeRequest(String email, String currentPassword, String newPassword) {
		super();
		this.email = email;
		this.currentPassword = currentPassword;
		this.newPassword = newPassword;
	}
    
    // 게터와 세터 메소드들...
}