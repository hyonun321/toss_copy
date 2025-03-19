package com.shop.cafe.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.cafe.dao.StockDao;
import com.shop.cafe.dao.StockSearchRepository;
import com.shop.cafe.dto.StockDocument;
import com.shop.cafe.dto.StockInfo;

@Service
public class StockIndexService {
    private final StockSearchRepository stockSearchRepository;
    private final StockDao stockDao; // 기존 DB의 주식 정보 접근용
    
    @Autowired
    public StockIndexService(StockSearchRepository stockSearchRepository, StockDao stockDao) {
        this.stockSearchRepository = stockSearchRepository;
        this.stockDao = stockDao;
    }
    
    // 모든 주식 정보를 엘라스틱서치에 인덱싱
    public void indexAllStocks() {
        List<StockInfo> allStocks = new ArrayList<>();
        allStocks.addAll(stockDao.getDomesticStocks());
        allStocks.addAll(stockDao.getOverseasStocks());
        
        List<StockDocument> documents = allStocks.stream()
            .map(this::convertToDocument)
            .collect(Collectors.toList());
        
        stockSearchRepository.saveAll(documents);
    }
    
    private StockDocument convertToDocument(StockInfo stockInfo) {
        StockDocument document = new StockDocument(null, null, null, null, null, null);
        document.setId(stockInfo.getCode());
        document.setCode(stockInfo.getCode());
        document.setName(stockInfo.getName());
        document.setExchangeCode(stockInfo.getExchangeCode());
        // 가격은 문자열에서 숫자로 변환 필요
        try {
            String priceStr = stockInfo.getPrice().replaceAll("[^0-9.]", "");
            document.setPrice(Double.parseDouble(priceStr));
        } catch (Exception e) {
            document.setPrice(0.0);
        }
        return document;
    }
}