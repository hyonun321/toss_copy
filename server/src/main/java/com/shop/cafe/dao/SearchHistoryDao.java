package com.shop.cafe.dao;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SearchHistoryDao {
    private final JdbcTemplate jdbcTemplate;
    
    public SearchHistoryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public void saveSearchQuery(String email, String query) {
        String sql = "INSERT INTO search_history (email, query) VALUES (?, ?) " +
                     "ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP";
        jdbcTemplate.update(sql, email, query);
    }
    
    public List<String> getRecentSearches(String email) {
        String sql = "SELECT query FROM search_history WHERE email = ? " +
                     "ORDER BY created_at DESC LIMIT 10";
        return jdbcTemplate.queryForList(sql, String.class, email);
    }
    
    // 검색어 삭제
    public void deleteSearchQuery(String email, String query) {
        String sql = "DELETE FROM search_history WHERE email = ? AND query = ?";
        jdbcTemplate.update(sql, email, query);
    }
}