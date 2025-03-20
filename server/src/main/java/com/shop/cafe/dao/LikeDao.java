package com.shop.cafe.dao;

import com.shop.cafe.dto.Like;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class LikeDao {
    private final JdbcTemplate jdbcTemplate;

    public LikeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addLike(Like like) {
        String sql = "INSERT INTO likes (email, stock_code) VALUES (?, ?)";
        jdbcTemplate.update(sql, like.getEmail(), like.getStockCode());
    }

    public void removeLike(Like like) {
        String sql = "DELETE FROM likes WHERE email = ? AND stock_code = ?";
        jdbcTemplate.update(sql, like.getEmail(), like.getStockCode());
    }

    public boolean isLiked(String email, String stockCode) {
        String sql = "SELECT COUNT(*) FROM likes WHERE email = ? AND stock_code = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email, stockCode);
        return count != null && count > 0;
    }
    
    public List<Map<String, String>> getLikedStocks(String email) {
        String sql = "SELECT stock_code FROM likes WHERE email = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, String> map = new HashMap<>();
            map.put("stock_code", rs.getString("stock_code"));
            return map;
        }, email);
    }
}