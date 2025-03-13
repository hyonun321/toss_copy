package com.shop.cafe.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.shop.cafe.dto.Review;

@Mapper
public interface ReviewDao {	
	
	public List<Review> getRecentReviews(Review r) throws Exception ;
	
	public  void insertReview(Review m) throws Exception;
	


}
