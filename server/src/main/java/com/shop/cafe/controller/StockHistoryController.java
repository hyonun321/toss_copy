package com.shop.cafe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shop.cafe.service.SearchHistoryService;

@RestController
@RequestMapping("/api/search")
@CrossOrigin({"http://127.0.0.1:5500/","http://localhost:3000"})
public class StockHistoryController {
    private final SearchHistoryService searchHistoryService;
    
    public StockHistoryController(SearchHistoryService searchHistoryService) {
        this.searchHistoryService = searchHistoryService;
    }
    
    // 최근 검색어 조회 API
    @GetMapping("/history")
    public ResponseEntity<List<String>> getSearchHistory(@RequestParam String email) {
        List<String> searchHistory = searchHistoryService.getRecentSearches(email);
        return ResponseEntity.ok(searchHistory);
    }
    
    // 검색어 저장 API
    @PostMapping("/history")
    public ResponseEntity<Void> saveSearchQuery(
            @RequestParam String email,
            @RequestParam String query) {
        searchHistoryService.saveSearchQuery(email, query);
        return ResponseEntity.ok().build();
    }
    
    // 검색어 삭제 API
    @DeleteMapping("/history")
    public ResponseEntity<Void> deleteSearchQuery(
            @RequestParam String email,
            @RequestParam String query) {
        searchHistoryService.deleteSearchQuery(email, query);
        return ResponseEntity.ok().build();
    }
}