package com.shop.cafe.dto;

import java.util.List;

public class StockApiResponse {
    private String resultCode;       // 결과 코드
    private String resultMessage;    // 결과 메시지
    private List<StockInfo> stocks;  // 주식 정보 목록
    
    // 생성자
    public StockApiResponse() {}
    
    public StockApiResponse(String resultCode, String resultMessage, List<StockInfo> stocks) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.stocks = stocks;
    }
    
    // Getter와 Setter
    public String getResultCode() { return resultCode; }
    public void setResultCode(String resultCode) { this.resultCode = resultCode; }
    
    public String getResultMessage() { return resultMessage; }
    public void setResultMessage(String resultMessage) { this.resultMessage = resultMessage; }
    
    public List<StockInfo> getStocks() { return stocks; }
    public void setStocks(List<StockInfo> stocks) { this.stocks = stocks; }
}