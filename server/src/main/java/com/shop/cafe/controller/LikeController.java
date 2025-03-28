package com.shop.cafe.controller;

import com.shop.cafe.dto.Like;
import com.shop.cafe.dto.StockApiResponse;
import com.shop.cafe.dto.StockCodeName;
import com.shop.cafe.dto.StockInfo;
import com.shop.cafe.service.LikeService;
import com.shop.cafe.service.StockService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin({"http://127.0.0.1:3000/","http://127.0.0.1:5500/","http://localhost:3000"})
public class LikeController {
    private final LikeService likeService;
    private final StockService stockService;
    
    public LikeController(LikeService likeService, StockService stockService) {
        this.likeService = likeService;
        this.stockService = stockService;
    }
    @PostMapping("/add")
    public ResponseEntity<String> addLike(@RequestBody Like like) {
        try {
            // 거래소 코드가 없으면 코드 패턴으로 추측
            if (like.getExchangeCode() == null || like.getExchangeCode().isEmpty()) {
                String exchangeCode = like.getStockCode().matches("^[0-9]+$") ? "KRX" : "NAS";
                like.setExchangeCode(exchangeCode);
            }
            
            likeService.addLike(like);
            return ResponseEntity.ok("좋아요가 추가되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("좋아요 추가 실패");
        }
    }
    @GetMapping("/stocks")
    public ResponseEntity<StockApiResponse> getFavoriteStocks(@RequestParam String email) {
        try {
            // 1. 사용자의 좋아요한 주식 코드 목록 가져오기
            List<Map<String, String>> favoritesList = likeService.getLikedStocks(email);
            
            if (favoritesList.isEmpty()) {
                return ResponseEntity.ok(new StockApiResponse("0", "좋아요한 종목이 없습니다.", new ArrayList<>()));
            }
            
            // 2. 좋아요 목록에서 코드, 종목명, 거래소 정보 추출
            List<StockCodeName> stockCodeNames = favoritesList.stream()
                .map(item -> new StockCodeName(
                    item.get("stock_code"),
                    item.get("stock_name"),
                    item.get("exchange_code") // 거래소 코드 추가
                ))
                .collect(Collectors.toList());
            
            // 3. stockService의 getStocksByCodeNameList 메서드 사용
            List<StockInfo> stocks = stockService.getStocksByCodeNameList(stockCodeNames);
            
            // 4. 결과 반환
            StockApiResponse response = new StockApiResponse("0", "성공", stocks);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(new StockApiResponse("9999", "오류 발생: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/remove")
    public ResponseEntity<String> removeLike(@RequestBody Like like) {
        try {
            likeService.removeLike(like);
            return ResponseEntity.ok("좋아요가 제거되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("좋아요 제거 실패");
        }
    }

    @GetMapping("/isLiked")
    public ResponseEntity<Boolean> isLiked(@RequestParam String email, @RequestParam String stockCode) {
        try {
            return ResponseEntity.ok(likeService.isLiked(email, stockCode));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(false);
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, String>>> getFavoriteList(@RequestParam String email) {
        try {
            List<Map<String, String>> likedStocks = likeService.getLikedStocks(email);
            return ResponseEntity.ok(likedStocks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
