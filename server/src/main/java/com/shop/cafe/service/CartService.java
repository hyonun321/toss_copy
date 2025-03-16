package com.shop.cafe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.cafe.dao.CartDao;
import com.shop.cafe.dto.Cart;

@Service
public class CartService {
	
	@Autowired
	CartDao cartDao;
	
	public void addToCart(Cart cart) throws Exception{
		cartDao.addToCart(cart);
	}
}
