package com.shop.cafe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shop.cafe.dao.SearchHistoryDao;

@Service
public class SearchHistoryService {
    private final SearchHistoryDao searchHistoryDao;
    
    public SearchHistoryService(SearchHistoryDao searchHistoryDao) {
        this.searchHistoryDao = searchHistoryDao;
    }
    
    public void saveSearchQuery(String email, String query) {
        if (query != null && !query.trim().isEmpty()) {
            searchHistoryDao.saveSearchQuery(email, query.trim());
        }
    }
    
    public List<String> getRecentSearches(String email) {
        return searchHistoryDao.getRecentSearches(email);
    }
    
    public void deleteSearchQuery(String email, String query) {
        searchHistoryDao.deleteSearchQuery(email, query);
    }
}