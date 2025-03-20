package com.shop.cafe.dto;

public class Like {
    private String email;
    private String stockCode;
    private String stockName;
    private String exchangeCode; // 추가된 필드
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getStockCode() { return stockCode; }
    public void setStockCode(String stockCode) { this.stockCode = stockCode; }
    
    public String getStockName() { return stockName; }
    public void setStockName(String stockName) { this.stockName = stockName; }
    
    public String getExchangeCode() { return exchangeCode; }
    public void setExchangeCode(String exchangeCode) { this.exchangeCode = exchangeCode; }
}