package com.shop.cafe.dto;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "stock_symbols")
public class StockDocument {
	@Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String symbol; // code 대신 symbol로 변경

    @Field(type = FieldType.Text, analyzer = "nori")
    private String name;

    // 필요한 경우에만 사용
    @Field(type = FieldType.Text)
    private String description;

    // market으로 이름 변경
    @Field(type = FieldType.Keyword)
    private String market; // exchangeCode 대신 market으로 변경

    @Field(type = FieldType.Double)
    private Double price;

	public StockDocument(String id, String symbol, String name, String description, String market, Double price) {
		super();
		this.id = id;
		this.symbol = symbol;
		this.name = name;
		this.description = description;
		this.market = market;
		this.price = price;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMarket() {
		return market;
	}

	public void setMarket(String market) {
		this.market = market;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
    
}