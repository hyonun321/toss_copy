package com.shop.cafe.dao;

import com.shop.cafe.dto.Like;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class LikeDao{
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

    public boolean isLiked(String email) {
        String sql = "SELECT COUNT(*) FROM likes WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
}
