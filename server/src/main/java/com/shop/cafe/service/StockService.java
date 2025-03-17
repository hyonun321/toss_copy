// com.shop.cafe.service/StockService.java
package com.shop.cafe.service;

import com.shop.cafe.dao.StockDao;
import com.shop.cafe.dto.StockInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.logging.Logger;

@Service
public class StockService {
    private static final Logger logger = Logger.getLogger(StockService.class.getName());
    
    private final StockApiService stockApiService;
    private final StockDao stockDao;
    
    // 데이터 갱신 주기 (분)
    private static final int DATA_REFRESH_INTERVAL = 15;
    
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
    
    // 해외 주식 정보 조회
    public List<StockInfo> getOverseasStocks() {
        // 캐시된 데이터가 없거나 오래된 경우 갱신
        if (needsRefresh(stockDao.getOverseasLastUpdated())) {
            refreshOverseasStocks();
        }
        return stockDao.getOverseasStocks();
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
    
 // 정기적인 데이터 갱신 (15분마다)
    @Scheduled(fixedRate = 900000) // 15분 = 900,000ms
    public void scheduledDataRefresh() {
        logger.info("정기 주식 데이터 갱신 시작...");
        refreshDomesticVolumeRanking();
        refreshDomesticTradeValueRanking();
        refreshDomesticRisingRanking();
        refreshDomesticFallingRanking();
        // 해외 주식 갱신 코드 (필요한 경우)
    }
}