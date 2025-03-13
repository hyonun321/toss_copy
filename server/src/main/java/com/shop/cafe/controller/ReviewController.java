package com.shop.cafe.controller;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.shop.cafe.dto.Review;
import com.shop.cafe.service.ReviewService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ReviewController {
	
	@Autowired
	ReviewService reviewService;
	
	@PostMapping("getRecentReviews")
	public List<Review> getRecentReviews(@RequestBody Review r) {
		try {
			return reviewService.getRecentReviews(r);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	@PostMapping("insertReview")
	public void insertReview(@RequestBody Review r) {
		try {
			reviewService.insertReview(r);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
