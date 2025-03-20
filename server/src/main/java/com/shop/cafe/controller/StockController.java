package com.shop.cafe.controller;

import com.shop.cafe.dto.IndexApiResponse;
import com.shop.cafe.dto.IndexInfo;
import com.shop.cafe.dto.StockApiResponse;
import com.shop.cafe.dto.StockInfo;
import com.shop.cafe.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin({"http://127.0.0.1:5500/","http://127.0.0.1:3000/","http://localhost:3000"})
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // 국내 주식 목록 조회
    @GetMapping("/domestic")
    public ResponseEntity<StockApiResponse> getDomesticStocks() {
        List<StockInfo> stocks = stockService.getDomesticStocks();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 해외 주식 목록 조회
    @GetMapping("/overseas")
    public ResponseEntity<StockApiResponse> getOverseasStocks() {
        List<StockInfo> stocks = stockService.getOverseasStocks();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }
 // 미국 주식 거래대금 상위 조회
    @GetMapping("/overseas/trade-value")
    public ResponseEntity<StockApiResponse> getOverseasTradeValueRanking() {
        List<StockInfo> stocks = stockService.getOverseasTradeValueRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 미국 주식 거래량 상위 조회
    @GetMapping("/overseas/volume")
    public ResponseEntity<StockApiResponse> getOverseasVolumeRanking() {
        List<StockInfo> stocks = stockService.getOverseasVolumeRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 미국 주식 급상승 순위 조회
    @GetMapping("/overseas/rising")
    public ResponseEntity<StockApiResponse> getOverseasRisingRanking() {
        List<StockInfo> stocks = stockService.getOverseasRisingRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 미국 주식 급하락 순위 조회
    @GetMapping("/overseas/falling")
    public ResponseEntity<StockApiResponse> getOverseasFallingRanking() {
        List<StockInfo> stocks = stockService.getOverseasFallingRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }
 // 인기 주식 목록 조회
    @GetMapping("/popular")
    public ResponseEntity<StockApiResponse> getPopularStocks() {
        List<StockInfo> stocks = stockService.getPopularStocks();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }
    // 국내 주식 거래량 상위 조회
    @GetMapping("/domestic/volume")
    public ResponseEntity<StockApiResponse> getDomesticVolumeRanking() {
        List<StockInfo> stocks = stockService.getDomesticVolumeRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 국내 주식 거래대금 상위 조회
    @GetMapping("/domestic/trade-value")
    public ResponseEntity<StockApiResponse> getDomesticTradeValueRanking() {
        List<StockInfo> stocks = stockService.getDomesticTradeValueRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 국내 주식 급상승 순위 조회
    @GetMapping("/domestic/rising")
    public ResponseEntity<StockApiResponse> getDomesticRisingRanking() {
        List<StockInfo> stocks = stockService.getDomesticRisingRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 국내 주식 급하락 순위 조회
    @GetMapping("/domestic/falling")
    public ResponseEntity<StockApiResponse> getDomesticFallingRanking() {
        List<StockInfo> stocks = stockService.getDomesticFallingRanking();
        StockApiResponse response = new StockApiResponse("0", "성공", stocks);
        return ResponseEntity.ok(response);
    }

    // 특정 종목 조회
    @GetMapping("/{code}")
    public ResponseEntity<StockInfo> getStockByCode(@PathVariable String code) {
        StockInfo stock = stockService.getStockByCode(code);
        if (stock != null) {
            return ResponseEntity.ok(stock);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 수동 데이터 갱신 (관리자용)
    @PostMapping("/refresh/domestic")
    public ResponseEntity<String> refreshDomesticStocks() {
        stockService.refreshDomesticStocks();
        return ResponseEntity.ok("국내 주식 데이터 갱신 요청이 완료되었습니다.");
    }

    // 수동 데이터 갱신 (관리자용)
    @PostMapping("/refresh/overseas")
    public ResponseEntity<String> refreshOverseasStocks() {
        stockService.refreshOverseasStocks();
        return ResponseEntity.ok("해외 주식 데이터 갱신 요청이 완료되었습니다.");
    }
    
    // 수동 거래량 데이터 갱신
    @PostMapping("/refresh/domestic/volume")
    public ResponseEntity<String> refreshDomesticVolumeRanking() {
        stockService.refreshDomesticVolumeRanking();
        return ResponseEntity.ok("국내 주식 거래량 순위 데이터 갱신 요청이 완료되었습니다.");
    }
    
    // 수동 거래대금 데이터 갱신
    @PostMapping("/refresh/domestic/trade-value")
    public ResponseEntity<String> refreshDomesticTradeValueRanking() {
        stockService.refreshDomesticTradeValueRanking();
        return ResponseEntity.ok("국내 주식 거래대금 순위 데이터 갱신 요청이 완료되었습니다.");
    }
    
    // 수동 급상승 데이터 갱신
    @PostMapping("/refresh/domestic/rising")
    public ResponseEntity<String> refreshDomesticRisingRanking() {
        stockService.refreshDomesticRisingRanking();
        return ResponseEntity.ok("국내 주식 급상승 순위 데이터 갱신 요청이 완료되었습니다.");
    }
    
    // 수동 급하락 데이터 갱신
    @PostMapping("/refresh/domestic/falling")
    public ResponseEntity<String> refreshDomesticFallingRanking() {
        stockService.refreshDomesticFallingRanking();
        return ResponseEntity.ok("국내 주식 급하락 순위 데이터 갱신 요청이 완료되었습니다.");
    }
    

    // 모든 지수 정보 조회
    @GetMapping("/indices/all")
    public ResponseEntity<IndexApiResponse> getAllIndices() {
        List<IndexInfo> indices = stockService.getAllIndices();
        IndexApiResponse response = new IndexApiResponse("0", "성공", indices);
        return ResponseEntity.ok(response);
    }
    
    // 국내 지수 정보 조회
    @GetMapping("/indices/domestic")
    public ResponseEntity<IndexApiResponse> getDomesticIndices() {
        List<IndexInfo> indices = stockService.getDomesticIndices();
        IndexApiResponse response = new IndexApiResponse("0", "성공", indices);
        return ResponseEntity.ok(response);
    }
    
    // 해외 지수 정보 조회
    @GetMapping("/indices/overseas")
    public ResponseEntity<IndexApiResponse> getOverseasIndices() {
        List<IndexInfo> indices = stockService.getOverseasIndices();
        IndexApiResponse response = new IndexApiResponse("0", "성공", indices);
        return ResponseEntity.ok(response);
    }
}