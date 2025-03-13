package com.shop.cafe.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shop.cafe.dto.Product;
import com.shop.cafe.service.ProductService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ProductController {

	ProductService productService = new ProductService();
	Map<String, Object> storage = new HashMap();
	
	@GetMapping("getAllProducts")
	public List<Product> getAllProducts() throws Exception {
		
		try {
			Object o = storage.get("firstPageProducts");
			if(o==null) {
				List<Product> list = productService.getAllProducts();
				storage.put("firstPageProducts",list);
				return list;
			}
			return (List<Product>)o;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
		}
}
