package com.shop.cafe.dto;

public class Like{
    private String email;
    private String stockCode;

    public Like() {
        super();
    }

    public Like(String email, String stockCode) {
        super();
        this.email = email;
        this.stockCode = stockCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStockCode() {
        return stockCode;
    }

    public void setStockCode(String stockCode) {
        this.stockCode = stockCode;
    }

    @Override
    public String toString() {
        return "LikeDTO [email=" + email + ", stockCode=" + stockCode + "]";
    }
}
