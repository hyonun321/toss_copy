package com.shop.cafe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shop.cafe.dao.StockSearchRepository;
import com.shop.cafe.dto.StockDocument;

@RestController
@CrossOrigin({"http://127.0.0.1:5500/","http://localhost:3000"})
@RequestMapping("/api/search")
public class StockSearchController {
    private final StockSearchRepository stockSearchRepository;
    
    @Autowired
    public StockSearchController(StockSearchRepository stockSearchRepository) {
        this.stockSearchRepository = stockSearchRepository;
    }
    
    @GetMapping("/stocks")
    public ResponseEntity<List<StockDocument>> searchStocks(@RequestParam String query) {
        List<StockDocument> results = stockSearchRepository.findByNameContainingOrSymbolContaining(query, query);
        System.out.println(results);
        return ResponseEntity.ok(results);
    }
}