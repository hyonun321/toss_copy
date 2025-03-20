package com.shop.cafe.dto;

import java.time.LocalDateTime;

public class IndexInfo {
    private String name;            // 지수명 (코스피, 코스닥, 다우존스, 나스닥, S&P 500)
    private String value;           // 현재 지수값
    private String change;          // 전일대비 변화량
    private String changeRate;      // 변화율
    private boolean negative;       // 하락 여부
    private LocalDateTime lastUpdated; // 최종 업데이트 시간
    
    public IndexInfo() {
        this.lastUpdated = LocalDateTime.now();
    }
    
    // 생성자
    public IndexInfo(String name, String value, String change, String changeRate, boolean negative) {
        this.name = name;
        this.value = value;
        this.change = change;
        this.changeRate = changeRate;
        this.negative = negative;
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public String getChange() { return change; }
    public void setChange(String change) { this.change = change; }
    
    public String getChangeRate() { return changeRate; }
    public void setChangeRate(String changeRate) { this.changeRate = changeRate; }
    
    public boolean isNegative() { return negative; }
    public void setNegative(boolean negative) { this.negative = negative; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    @Override
    public String toString() {
        return "IndexInfo{" +
                "name='" + name + '\'' +
                ", value='" + value + '\'' +
                ", change='" + change + '\'' +
                ", changeRate='" + changeRate + '\'' +
                ", negative=" + negative +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}