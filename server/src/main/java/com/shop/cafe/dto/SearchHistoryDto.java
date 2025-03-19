package com.shop.cafe.dto;

import java.time.LocalDateTime;

public class SearchHistoryDto {
    private Long id;
    private String email;
    private String query;
    private LocalDateTime createdAt;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getQuery() {
		return query;
	}
	public void setQuery(String query) {
		this.query = query;
	}
	public SearchHistoryDto(Long id, String email, String query, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.email = email;
		this.query = query;
		this.createdAt = createdAt;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    // 생성자, getter, setter 생략
}