package com.shop.cafe.dao;

import java.util.*;

import org.apache.ibatis.annotations.Mapper;


import com.shop.cafe.dto.Product;

@Mapper
public interface ProductDao {
	
	
	public  List<Product> getAllProducts() throws Exception;

	
	
}
