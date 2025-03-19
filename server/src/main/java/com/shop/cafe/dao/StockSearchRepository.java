package com.shop.cafe.dao;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.shop.cafe.dto.StockDocument;

import java.util.List;

public interface StockSearchRepository extends ElasticsearchRepository<StockDocument, String> {
    // 이름으로 검색 (부분 일치)
    List<StockDocument> findByNameContaining(String name);
    
    // 이름이나 설명에 키워드가 포함된 경우 검색
    List<StockDocument> findByNameContainingOrSymbolContaining(String name, String symbol);
}