package com.shop.cafe.dto;

public class Product {
	public int getProdcode() {
		return prodcode;
	}
	public void setProdcode(int prodcode) {
		this.prodcode = prodcode;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public String getProdname() {
		return prodname;
	}
	public void setProdname(String prodname) {
		this.prodname = prodname;
	}
	public String getPimg() {
		return pimg;
	}
	public Product(int prodcode, int price, String prodname, String pimg, String ptag) {
		super();
		this.prodcode = prodcode;
		this.price = price;
		this.prodname = prodname;
		this.pimg = pimg;
		this.ptag = ptag;
	}
	@Override
	public String toString() {
		return "Product [prodcode=" + prodcode + ", price=" + price + ", prodname=" + prodname + ", pimg=" + pimg + "]";
	}
	public void setPimg(String pimg) {
		this.pimg = pimg;
	}
	public void setPtag(String ptag) {
		this.ptag = ptag;
	}
	public String getPtag() {
		return ptag;
	}
	private int prodcode, price;
	private String prodname, pimg, ptag;
	
}
