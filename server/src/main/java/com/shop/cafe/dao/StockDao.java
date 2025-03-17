package com.shop.cafe.dao;

import com.shop.cafe.dto.StockInfo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class StockDao {
    // 메모리에 주식 정보 저장 (실제로는 DB를 사용해야 함)
    private static final Map<String, List<StockInfo>> stocksMap = new ConcurrentHashMap<>();
    private static final String DOMESTIC_KEY = "DOMESTIC";
    private static final String OVERSEAS_KEY = "OVERSEAS";

    // 각 카테고리별 최종 업데이트 시간을 저장하는 맵
    private static final Map<String, LocalDateTime> lastUpdatedMap = new ConcurrentHashMap<>();

    // 국내 주식 정보 저장
    public void saveDomesticStocks(List<StockInfo> stocks) {
        stocksMap.put(DOMESTIC_KEY, new ArrayList<>(stocks));
        lastUpdatedMap.put(DOMESTIC_KEY, LocalDateTime.now());
    }

    // 해외 주식 정보 저장
    public void saveOverseasStocks(List<StockInfo> stocks) {
        stocksMap.put(OVERSEAS_KEY, new ArrayList<>(stocks));
        lastUpdatedMap.put(OVERSEAS_KEY, LocalDateTime.now());
    }

    // 특정 카테고리의 주식 정보 저장
    public void saveStocks(String category, List<StockInfo> stocks) {
        stocksMap.put(category, new ArrayList<>(stocks));
        lastUpdatedMap.put(category, LocalDateTime.now());
    }

    // 국내 주식 정보 조회
    public List<StockInfo> getDomesticStocks() {
        return stocksMap.getOrDefault(DOMESTIC_KEY, new ArrayList<>());
    }

    // 해외 주식 정보 조회
    public List<StockInfo> getOverseasStocks() {
        return stocksMap.getOrDefault(OVERSEAS_KEY, new ArrayList<>());
    }

    // 특정 카테고리의 주식 정보 조회
    public List<StockInfo> getStocks(String category) {
        return stocksMap.getOrDefault(category, new ArrayList<>());
    }

    // 국내 주식 업데이트 시간 확인
    public LocalDateTime getDomesticLastUpdated() {
        return lastUpdatedMap.get(DOMESTIC_KEY);
    }

    // 해외 주식 업데이트 시간 확인
    public LocalDateTime getOverseasLastUpdated() {
        return lastUpdatedMap.get(OVERSEAS_KEY);
    }

    // 특정 카테고리의 업데이트 시간 확인
    public LocalDateTime getLastUpdated(String category) {
        return lastUpdatedMap.get(category);
    }

    // 주식 코드로 특정 주식 정보 조회
    public StockInfo getStockByCode(String code) {
        // 모든 카테고리에서 검색
        for (List<StockInfo> stocks : stocksMap.values()) {
            for (StockInfo stock : stocks) {
                if (stock.getCode().equals(code)) {
                    return stock;
                }
            }
        }
        return null;
    }
}