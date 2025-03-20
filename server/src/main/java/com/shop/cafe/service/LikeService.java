package com.shop.cafe.service;

import com.shop.cafe.dao.LikeDao;
import com.shop.cafe.dto.Like;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    private final LikeDao likeDao;

    public LikeService(LikeDao likeDao) {
        this.likeDao = likeDao;
    }

    public void addLike(Like like) {
        likeDao.addLike(like);
    }

    public void removeLike(Like like) {
        likeDao.removeLike(like);
    }

    public boolean isLiked(String email) {
        return likeDao.isLiked(email);
    }
}
