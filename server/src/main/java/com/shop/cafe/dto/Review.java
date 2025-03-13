package com.shop.cafe.dto;

public class Review {
	private String reviewer, review;
	private int prodcode, reviewNo;
	public String getReviewer() {
		return reviewer;
	}
	public void setReviewer(String reviewer) {
		this.reviewer = reviewer;
	}
	public String getReview() {
		return review;
	}
	public void setReview(String review) {
		this.review = review;
	}
	@Override
	public String toString() {
		return "Review [reviewer=" + reviewer + ", review=" + review + ", prodcode=" + prodcode + ", reviewNo="
				+ reviewNo + "]";
	}
	public Review(String reviewer, String review, int prodcode, int reviewNo) {
		super();
		this.reviewer = reviewer;
		this.review = review;
		this.prodcode = prodcode;
		this.reviewNo = reviewNo;
	}
	public Review() {
		super();
		// TODO Auto-generated constructor stub
	}
	public int getProdcode() {
		return prodcode;
	}
	public void setProdcode(int prodcode) {
		this.prodcode = prodcode;
	}
	public int getReviewNo() {
		return reviewNo;
	}
	public void setReviewNo(int reviewNo) {
		this.reviewNo = reviewNo;
	}
}
