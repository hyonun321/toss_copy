package com.shop.cafe.dao;

import org.apache.ibatis.annotations.Mapper;

import com.shop.cafe.dto.Cart;

@Mapper
public interface CartDao {
	
	public void addToCart(Cart cart) throws Exception;

}
