package com.shop.cafe.dto;

import java.time.LocalDateTime;

public class StockInfo {
    private String code; // 종목 코드
    private String name; // 종목명
    private String price; // 현재가
    private String change; // 전일대비
    private String changeRate; // 등락률
    private String volume; // 거래량
    private String exchangeCode; // 거래소 코드 (국내/해외)
    private LocalDateTime lastUpdated; // 마지막 업데이트 시간
    private int rank; // 순위
    private boolean isPositiveChange; // 상승 여부

    // 생성자
    public StockInfo() {}

    public StockInfo(String code, String name, String price, String change,
                     String changeRate, String volume, String exchangeCode) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.change = change;
        this.changeRate = changeRate;
        this.volume = volume;
        this.exchangeCode = exchangeCode;
        this.lastUpdated = LocalDateTime.now();
        this.isPositiveChange = !change.startsWith("-"); // 기본값 설정
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getChange() { return change; }
    public void setChange(String change) { this.change = change; }

    public String getChangeRate() { return changeRate; }
    public void setChangeRate(String changeRate) { this.changeRate = changeRate; }

    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }

    public String getExchangeCode() { return exchangeCode; }
    public void setExchangeCode(String exchangeCode) { this.exchangeCode = exchangeCode; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    // 새로 추가된 메소드
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public boolean isPositiveChange() { return isPositiveChange; }
    public void setPositiveChange(boolean positiveChange) { this.isPositiveChange = positiveChange; }

    @Override
    public String toString() {
        return "StockInfo{" +
                "code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", price='" + price + '\'' +
                ", change='" + change + '\'' +
                ", changeRate='" + changeRate + '\'' +
                ", volume='" + volume + '\'' +
                ", exchangeCode='" + exchangeCode + '\'' +
                ", lastUpdated=" + lastUpdated +
                ", rank=" + rank +
                ", isPositiveChange=" + isPositiveChange +
                '}';
    }
}