package com.shop.cafe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.cafe.dao.MemberDao;
import com.shop.cafe.dao.ReviewDao;
import com.shop.cafe.dto.Member;
import com.shop.cafe.dto.Review;

@Service
public class ReviewService {
	@Autowired
	ReviewDao reviewDao;

	public List<Review> getRecentReviews(Review r) throws Exception{
		return reviewDao.getRecentReviews(r);
	}

	public void insertReview(Review r) throws Exception{
		reviewDao.insertReview(r);
	}

}
