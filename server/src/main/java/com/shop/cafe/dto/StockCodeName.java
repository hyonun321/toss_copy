package com.shop.cafe.dto;

public class StockCodeName {
    private String code;
    private String name;
    private String exchangeCode; // 추가된 필드
    
    public StockCodeName(String code, String name, String exchangeCode) {
        this.code = code;
        this.name = name;
        this.exchangeCode = exchangeCode;
    }
    
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getExchangeCode() { return exchangeCode; }
    
    // 거래소 코드가 비어있을 경우를 대비한 유틸리티 메서드
    public String getEffectiveExchangeCode() {
        if (exchangeCode != null && !exchangeCode.isEmpty()) {
            return exchangeCode;
        }
        
        // 코드 패턴으로 추측
        return code.matches("^[0-9]+$") ? "KRX" : "NAS";
    }
}