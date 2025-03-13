package com.shop.cafe.dao;

import java.sql.*;
import java.util.*;

import org.springframework.stereotype.Component;

import com.shop.cafe.dto.Product;

@Component
public class ProductDao {
	
	public List<Product> getAllProducts() throws Exception{
		Class.forName("com.mysql.cj.jdbc.Driver");
		try(
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/ureca?serverTimezone=UTC","root","1235");
			PreparedStatement stmt=con.prepareStatement("select * from product");
			ResultSet rs=stmt.executeQuery();
				) {	
			
			List<Product> list=new ArrayList<>();
			while(rs.next()) {
				int prodcode=rs.getInt("prodcode");
				String prodname=rs.getString("prodname");
				int price=rs.getInt("price");
				String pimg=rs.getString("pimg");
				String ptag=rs.getString("ptag");
				list.add(new Product( prodcode, price,prodname, pimg,ptag));
			}
			return list;
		}		
	}	
	
}
