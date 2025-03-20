package com.shop.cafe.dto;

import java.util.List;

public class IndexApiResponse {
    private String resultCode;
    private String message;
    private List<IndexInfo> indices;
    
    public IndexApiResponse(String resultCode, String message, List<IndexInfo> indices) {
        this.resultCode = resultCode;
        this.message = message;
        this.indices = indices;
    }
    
    // Getters and setters
    public String getResultCode() { return resultCode; }
    public void setResultCode(String resultCode) { this.resultCode = resultCode; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public List<IndexInfo> getIndices() { return indices; }
    public void setIndices(List<IndexInfo> indices) { this.indices = indices; }
}