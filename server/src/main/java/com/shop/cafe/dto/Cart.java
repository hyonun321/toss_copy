package com.shop.cafe.dto;

public class Cart {
	private String email;
	private int prodcode, quantity;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getProdcode() {
		return prodcode;
	}
	public void setProdcode(int prodcode) {
		this.prodcode = prodcode;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public Cart(String email, int prodcode, int quantity) {
		super();
		this.email = email;
		this.prodcode = prodcode;
		this.quantity = quantity;
	}
	public Cart() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "Cart [email=" + email + ", prodcode=" + prodcode + ", quantity=" + quantity + "]";
	}
	
	

}
