package com.shop.cafe.dao;

import com.shop.cafe.dto.IndexInfo;
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
    // 지수 정보를 위한 키
    private static final String DOMESTIC_INDICES_KEY = "DOMESTIC_INDICES";
    private static final String OVERSEAS_INDICES_KEY = "OVERSEAS_INDICES";
    private static final String ALL_INDICES_KEY = "ALL_INDICES";
    // 각 카테고리별 최종 업데이트 시간을 저장하는 맵
 // 지수 정보 저장 맵
    private static final Map<String, List<IndexInfo>> indicesMap = new ConcurrentHashMap<>();
    private static final Map<String, LocalDateTime> lastUpdatedMap = new ConcurrentHashMap<>();
    // 국내 지수 정보 저장
    public void saveDomesticIndices(List<IndexInfo> indices) {
        indicesMap.put(DOMESTIC_INDICES_KEY, new ArrayList<>(indices));
        lastUpdatedMap.put(DOMESTIC_INDICES_KEY, LocalDateTime.now());
    }
    
    // 해외 지수 정보 저장
    public void saveOverseasIndices(List<IndexInfo> indices) {
        indicesMap.put(OVERSEAS_INDICES_KEY, new ArrayList<>(indices));
        lastUpdatedMap.put(OVERSEAS_INDICES_KEY, LocalDateTime.now());
    }
    
    // 모든 지수 정보 저장
    public void saveAllIndices(List<IndexInfo> indices) {
        indicesMap.put(ALL_INDICES_KEY, new ArrayList<>(indices));
        lastUpdatedMap.put(ALL_INDICES_KEY, LocalDateTime.now());
    }
    
    // 국내 지수 정보 조회
    public List<IndexInfo> getDomesticIndices() {
        return indicesMap.getOrDefault(DOMESTIC_INDICES_KEY, new ArrayList<>());
    }
    
    // 해외 지수 정보 조회
    public List<IndexInfo> getOverseasIndices() {
        return indicesMap.getOrDefault(OVERSEAS_INDICES_KEY, new ArrayList<>());
    }
    
    // 모든 지수 정보 조회
    public List<IndexInfo> getAllIndices() {
        return indicesMap.getOrDefault(ALL_INDICES_KEY, new ArrayList<>());
    }
    
    // 국내 지수 업데이트 시간 확인
    public LocalDateTime getDomesticIndicesLastUpdated() {
        return lastUpdatedMap.get(DOMESTIC_INDICES_KEY);
    }
    
    // 해외 지수 업데이트 시간 확인
    public LocalDateTime getOverseasIndicesLastUpdated() {
        return lastUpdatedMap.get(OVERSEAS_INDICES_KEY);
    }
    
    // 모든 지수 업데이트 시간 확인
    public LocalDateTime getAllIndicesLastUpdated() {
        return lastUpdatedMap.get(ALL_INDICES_KEY);
    }
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
 // 개별 주식 정보 저장
    public void saveStockInfo(String code, StockInfo stockInfo) {
        // 임시 맵 생성
        List<StockInfo> singleStockList = new ArrayList<>();
        singleStockList.add(stockInfo);
        
        // 해당 코드에 대한 정보만 저장하는 맵 생성
        stocksMap.put("STOCK_" + code, singleStockList);
        lastUpdatedMap.put("STOCK_" + code, LocalDateTime.now());
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