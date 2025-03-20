// com.shop.cafe.service/StockService.java
package com.shop.cafe.service;

import com.shop.cafe.dao.StockDao;
import com.shop.cafe.dto.IndexInfo;
import com.shop.cafe.dto.StockCodeName;
import com.shop.cafe.dto.StockInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Service
public class StockService {
    private static final Logger logger = Logger.getLogger(StockService.class.getName());
    
    private final StockApiService stockApiService;
    private final StockDao stockDao;
    
    // 데이터 갱신 주기 (분)
    private static final int DATA_REFRESH_INTERVAL = 15;
    private static final String POPULAR_STOCKS_KEY = "popular_stocks";
    
    @Autowired
    public StockService(StockApiService stockApiService, StockDao stockDao) {
        this.stockApiService = stockApiService;
        this.stockDao = stockDao;
    }
    
    // 국내 주식 정보 조회
    public List<StockInfo> getDomesticStocks() {
        if (needsRefresh(stockDao.getDomesticLastUpdated())) {
        	refreshDomesticStocks();
        }
        return stockDao.getDomesticStocks();
    }

 // 미국 주식 거래량 상위 종목 조회
 public List<StockInfo> getOverseasVolumeRanking() {
     if (needsRefresh(stockDao.getLastUpdated("overseas_volume"))) {
         refreshOverseasVolumeRanking();
     }
     return stockDao.getStocks("overseas_volume");
 }

 // 미국 주식 급상승 종목 조회
 public List<StockInfo> getOverseasRisingRanking() {
     if (needsRefresh(stockDao.getLastUpdated("overseas_rising"))) {
         refreshOverseasRisingRanking();
     }
     return stockDao.getStocks("overseas_rising");
 }

 // 미국 주식 급하락 종목 조회
 public List<StockInfo> getOverseasFallingRanking() {
     if (needsRefresh(stockDao.getLastUpdated("overseas_falling"))) {
         refreshOverseasFallingRanking();
     }
     return stockDao.getStocks("overseas_falling");
 }

 // 미국 주식 거래량 데이터 갱신
 public void refreshOverseasVolumeRanking() {
     try {
         logger.info("미국 주식 거래량 순위 데이터 갱신 시작...");
         List<StockInfo> stocks = stockApiService.getOverseasVolumeRanking();
         stockDao.saveStocks("overseas_volume", stocks);
         logger.info("미국 주식 거래량 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
     } catch (Exception e) {
         logger.severe("미국 주식 거래량 순위 데이터 갱신 실패: " + e.getMessage());
     }
 }

 // 미국 주식 급상승 데이터 갱신
 public void refreshOverseasRisingRanking() {
     try {
         logger.info("미국 주식 급상승 순위 데이터 갱신 시작...");
         List<StockInfo> stocks = stockApiService.getOverseasRisingRanking();
         stockDao.saveStocks("overseas_rising", stocks);
         logger.info("미국 주식 급상승 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
     } catch (Exception e) {
         logger.severe("미국 주식 급상승 순위 데이터 갱신 실패: " + e.getMessage());
     }
 }

 // 미국 주식 급하락 데이터 갱신
 public void refreshOverseasFallingRanking() {
     try {
         logger.info("미국 주식 급하락 순위 데이터 갱신 시작...");
         List<StockInfo> stocks = stockApiService.getOverseasFallingRanking();
         stockDao.saveStocks("overseas_falling", stocks);
         logger.info("미국 주식 급하락 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
     } catch (Exception e) {
         logger.severe("미국 주식 급하락 순위 데이터 갱신 실패: " + e.getMessage());
     }
 }
    // 해외 주식 정보 조회
    public List<StockInfo> getOverseasStocks() {
        // 캐시된 데이터가 없거나 오래된 경우 갱신
        if (needsRefresh(stockDao.getOverseasLastUpdated())) {
        	refreshOverseasStocks();
        }
        return stockDao.getOverseasStocks();
    }
    
 // 인기 주식 조회
    public List<StockInfo> getPopularStocks() {
        if (needsRefresh(stockDao.getLastUpdated(POPULAR_STOCKS_KEY))) {
            refreshPopularStocks();
        }
        return stockDao.getStocks(POPULAR_STOCKS_KEY);
    }
    
 // 인기 주식 데이터 갱신
    public void refreshPopularStocks() {
        try {
            logger.info("인기 주식 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getPopularStocks();
            stockDao.saveStocks(POPULAR_STOCKS_KEY, stocks);
            logger.info("인기 주식 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("인기 주식 데이터 갱신 실패: " + e.getMessage());
        }
    }
    
    // 특정 종목 정보 조회
    public StockInfo getStockByCode(String code) {
        return stockDao.getStockByCode(code);
    }

    // 국내 주식 거래량 상위 종목 조회
    public List<StockInfo> getDomesticVolumeRanking() {
        if (needsRefresh(stockDao.getLastUpdated("domestic_volume"))) {
            refreshDomesticVolumeRanking();
        }
        return stockDao.getStocks("domestic_volume");
    }
    
    // 국내 주식 거래대금 상위 종목 조회
    public List<StockInfo> getDomesticTradeValueRanking() {
        if (needsRefresh(stockDao.getLastUpdated("domestic_trade_value"))) {
            refreshDomesticTradeValueRanking();
        }
        return stockDao.getStocks("domestic_trade_value");
    }
    
    // 국내 주식 급상승 종목 조회
    public List<StockInfo> getDomesticRisingRanking() {
        if (needsRefresh(stockDao.getLastUpdated("domestic_rising"))) {
            refreshDomesticRisingRanking();
        }
        return stockDao.getStocks("domestic_rising");
    }
    
    // 국내 주식 급하락 종목 조회
    public List<StockInfo> getDomesticFallingRanking() {
        if (needsRefresh(stockDao.getLastUpdated("domestic_falling"))) {
            refreshDomesticFallingRanking();
        }
        return stockDao.getStocks("domestic_falling");
    }
    public List<StockInfo> getStocksByCodeNameList(List<StockCodeName> stockCodeNames) {
        List<StockInfo> result = new ArrayList<>();
        
        for (StockCodeName pair : stockCodeNames) {
            String code = pair.getCode();
            String name = pair.getName();
            String exchangeCode = pair.getEffectiveExchangeCode();
            
            // 메모리에서 먼저 검색
            StockInfo stockInfo = stockDao.getStockByCode(code);
            
            // 메모리에 없거나 데이터가 오래된 경우 API 호출
            if (stockInfo == null || needsRefresh(stockInfo.getLastUpdated())) {
                try {
                    // 개별 종목 정보를 코드, 종목명, 거래소 정보와 함께 요청
                    stockInfo = stockApiService.getStockByCode(code, name, exchangeCode);
                    
                    if (stockInfo != null) {
                        // 결과에 추가
                        result.add(stockInfo);
                        
                        // 캐시에 저장 (선택적)
                        stockDao.saveStockInfo(code, stockInfo);
                    } else {
                        // API 호출은 실패했지만 기본 정보를 제공
                        StockInfo basicInfo = new StockInfo(
                            code, name, "0", "0", "0", "0", exchangeCode
                        );
                        result.add(basicInfo);
                    }
                } catch (Exception e) {
                    logger.warning("코드 " + code + "에 대한 API 호출 실패: " + e.getMessage());
                    // 에러 발생 시 기본 정보 제공
                    StockInfo basicInfo = new StockInfo(
                        code, name, "0", "0", "0", "0", exchangeCode
                    );
                    result.add(basicInfo);
                }
            } else {
                // 캐시된 정보에 종목명이 없는 경우 설정
                if (stockInfo.getName() == null || stockInfo.getName().isEmpty()) {
                    stockInfo.setName(name);
                }
                
                // 메모리에 있는 경우 그대로 사용
                result.add(stockInfo);
            }
        }
        
        // 랭크 재설정
        for (int i = 0; i < result.size(); i++) {
            result.get(i).setRank(i + 1);
        }
        
        return result;
    }
    // 국내 주식 거래량 데이터 갱신
    public void refreshDomesticVolumeRanking() {
        try {
            logger.info("국내 주식 거래량 순위 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getDomesticVolumeRanking();
            stockDao.saveStocks("domestic_volume", stocks);
            logger.info("국내 주식 거래량 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("국내 주식 거래량 순위 데이터 갱신 실패: " + e.getMessage());
        }
    }
    
    // 국내 주식 거래대금 데이터 갱신
    public void refreshDomesticTradeValueRanking() {
        try {
            logger.info("국내 주식 거래대금 순위 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getDomesticTradeValueRanking();
            stockDao.saveStocks("domestic_trade_value", stocks);
            logger.info("국내 주식 거래대금 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("국내 주식 거래대금 순위 데이터 갱신 실패: " + e.getMessage());
        }
    }
    
    // 국내 주식 급상승 데이터 갱신
    public void refreshDomesticRisingRanking() {
        try {
            logger.info("국내 주식 급상승 순위 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getDomesticRisingRanking();
            stockDao.saveStocks("domestic_rising", stocks);
            logger.info("국내 주식 급상승 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("국내 주식 급상승 순위 데이터 갱신 실패: " + e.getMessage());
        }
    }
    
    // 국내 주식 급하락 데이터 갱신
    public void refreshDomesticFallingRanking() {
        try {
            logger.info("국내 주식 급하락 순위 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getDomesticFallingRanking();
            stockDao.saveStocks("domestic_falling", stocks);
            logger.info("국내 주식 급하락 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("국내 주식 급하락 순위 데이터 갱신 실패: " + e.getMessage());
        }
    }
    // 데이터 갱신 필요 여부 확인
    private boolean needsRefresh(LocalDateTime lastUpdated) {
        if (lastUpdated == null) {
            return true; // 아직 갱신된 적 없음
        }
        
        LocalDateTime now = LocalDateTime.now();
        long minutesElapsed = ChronoUnit.MINUTES.between(lastUpdated, now);
        
        return minutesElapsed >= DATA_REFRESH_INTERVAL;
    }
    
    // 국내 주식 데이터 갱신
    public void refreshDomesticStocks() {
        try {
            logger.info("국내 주식 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getDomesticStocks();
            stockDao.saveDomesticStocks(stocks);
            logger.info("국내 주식 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("국내 주식 데이터 갱신 실패: " + e.getMessage());
        }
    }
 // 미국 주식 거래대금 상위 종목 조회
    public List<StockInfo> getOverseasTradeValueRanking() {
        if (needsRefresh(stockDao.getLastUpdated("overseas_trade_value"))) {
            refreshOverseasTradeValueRanking();
        }
        return stockDao.getStocks("overseas_trade_value");
    }

    // 미국 주식 거래대금 데이터 갱신
    public void refreshOverseasTradeValueRanking() {
        try {
            logger.info("미국 주식 거래대금 순위 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getOverseasTradeValueRanking();
            stockDao.saveStocks("overseas_trade_value", stocks);
            logger.info("미국 주식 거래대금 순위 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("미국 주식 거래대금 순위 데이터 갱신 실패: " + e.getMessage());
        }
    }
    // 해외 주식 데이터 갱신
    public void refreshOverseasStocks() {
        try {
            logger.info("해외 주식 데이터 갱신 시작...");
            List<StockInfo> stocks = stockApiService.getOverseasStocks();
            stockDao.saveOverseasStocks(stocks);
            logger.info("해외 주식 데이터 갱신 완료: " + stocks.size() + "개 종목");
        } catch (Exception e) {
            logger.severe("해외 주식 데이터 갱신 실패: " + e.getMessage());
        }
    }

    // 모든 지수 정보 가져오기
    public List<IndexInfo> getAllIndices() {
        if (needsRefresh(stockDao.getAllIndicesLastUpdated())) {
            refreshAllIndices();
        }
        return stockDao.getAllIndices();
    }
    
    // 국내 지수 정보 가져오기
    public List<IndexInfo> getDomesticIndices() {
        if (needsRefresh(stockDao.getDomesticIndicesLastUpdated())) {
            refreshDomesticIndices();
        }
        return stockDao.getDomesticIndices();
    }
    
    // 해외 지수 정보 가져오기
    public List<IndexInfo> getOverseasIndices() {
        if (needsRefresh(stockDao.getOverseasIndicesLastUpdated())) {
            refreshOverseasIndices();
        }
        return stockDao.getOverseasIndices();
    }
    
    // 모든 지수 정보 갱신
    public void refreshAllIndices() {
        try {
            logger.info("모든 지수 정보 갱신 시작...");
            
            // 국내 지수 가져오기
            List<IndexInfo> domesticIndices = stockApiService.getDomesticIndices();
            stockDao.saveDomesticIndices(domesticIndices);
            
            // 해외 지수 가져오기
            List<IndexInfo> overseasIndices = stockApiService.getOverseasIndices();
            stockDao.saveOverseasIndices(overseasIndices);
            
            // 모든 지수 합치기
            List<IndexInfo> allIndices = new ArrayList<>();
            allIndices.addAll(overseasIndices); // 해외 지수를 먼저 넣어서 롤링시 먼저 보이게 함
            allIndices.addAll(domesticIndices);
            
            // 저장
            stockDao.saveAllIndices(allIndices);
            
            logger.info("모든 지수 정보 갱신 완료: " + allIndices.size() + "개 지수");
        } catch (Exception e) {
            logger.severe("지수 정보 갱신 실패: " + e.getMessage());
        }
    }
    
    // 국내 지수 정보 갱신
    public void refreshDomesticIndices() {
        try {
            logger.info("국내 지수 정보 갱신 시작...");
            List<IndexInfo> indices = stockApiService.getDomesticIndices();
            stockDao.saveDomesticIndices(indices);
            logger.info("국내 지수 정보 갱신 완료: " + indices.size() + "개 지수");
        } catch (Exception e) {
            logger.severe("국내 지수 정보 갱신 실패: " + e.getMessage());
        }
    }
    
    // 해외 지수 정보 갱신
    public void refreshOverseasIndices() {
        try {
            logger.info("해외 지수 정보 갱신 시작...");
            List<IndexInfo> indices = stockApiService.getOverseasIndices();
            stockDao.saveOverseasIndices(indices);
            logger.info("해외 지수 정보 갱신 완료: " + indices.size() + "개 지수");
        } catch (Exception e) {
            logger.severe("해외 지수 정보 갱신 실패: " + e.getMessage());
        }
    }
 // 정기적인 데이터 갱신 (15분마다)
    @Scheduled(fixedRate = 900000) // 15분 = 900,000ms
    public void scheduledDataRefresh() {
        logger.info("정기 주식 데이터 갱신 시작...");
        refreshDomesticVolumeRanking();
        refreshDomesticTradeValueRanking();
        refreshDomesticRisingRanking();
        refreshDomesticFallingRanking();
        refreshPopularStocks(); 

        // 미국 주식 갱신 (추가)
        refreshOverseasVolumeRanking();
        refreshOverseasRisingRanking();
        refreshOverseasFallingRanking();
        
        // 지수 갱신
        refreshAllIndices();
        logger.info("정기 주식 데이터 갱신 완료");
    }
}