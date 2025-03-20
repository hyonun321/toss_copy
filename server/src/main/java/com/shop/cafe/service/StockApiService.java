package com.shop.cafe.service;

import com.shop.cafe.dto.IndexInfo;
import com.shop.cafe.dto.StockInfo;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;

@Service
public class StockApiService {
    
    private static final Logger logger = Logger.getLogger(StockApiService.class.getName());
    private final Random random = new Random();
    
    @Value("${kis.app.key}")
    private String appKey;

    @Value("${kis.app.secret}")
    private String appSecret;

    @Value("${kis.api.url}")
    private String apiUrl;
    
    private final RestTemplate restTemplate;
    
    // 토큰 정보 저장
    private String accessToken;
    private long tokenExpirationTime;
    
    // 토큰 저장 파일 경로
    private static final String TOKEN_FILE_PATH = "kis_token.dat";
    
    public StockApiService() {
        this.restTemplate = new RestTemplate();
        // 서비스 시작 시 저장된 토큰 로드
        loadTokenFromFile();
    }
 // 코드별 주식 정보 불러오기 (종목명, 거래소 코드 포함)
    public StockInfo getStockByCode(String code, String name, String exchangeCode) {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패");
                return null;
            }

            // 거래소 코드에 따라 API 선택
            if ("KRX".equals(exchangeCode)) {
                // 국내주식 API 호출
                return getDomesticStockInfo(token, code, name);
            } else {
                // 해외주식 API 호출
                return getOverseasStockInfo(token, code, name, exchangeCode);
            }
        } catch (Exception e) {
            logger.warning("코드 " + code + " 조회 중 예외 발생: " + e.getMessage());
            return null;
        }
    }

    // 기존 메서드와의 호환성을 위한 오버로딩
    public StockInfo getStockByCode(String code, String name) {
        // 코드 패턴으로 거래소 추측
        String exchangeCode = code.matches("^[0-9]+$") ? "KRX" : "NAS";
        return getStockByCode(code, name, exchangeCode);
    }

 // 국내주식 정보 조회 메서드
 private StockInfo getDomesticStockInfo(String token, String code, String name) {
     try {
         String url = apiUrl + "/uapi/domestic-stock/v1/quotations/inquire-price";
         
         UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
             .queryParam("FID_COND_MRKT_DIV_CODE", "J")
             .queryParam("FID_INPUT_ISCD", code);
         
         HttpHeaders headers = new HttpHeaders();
         headers.setContentType(MediaType.APPLICATION_JSON);
         headers.set("authorization", "Bearer " + token);
         headers.set("appkey", appKey);
         headers.set("appsecret", appSecret);
         headers.set("tr_id", "FHKST01010100"); // 주식 현재가 시세 TR ID
         headers.set("custtype", "P");
         
         HttpEntity<String> requestEntity = new HttpEntity<>(headers);
         
         ResponseEntity<String> response = restTemplate.exchange(
             builder.toUriString(),
             HttpMethod.GET,
             requestEntity,
             String.class
         );
         
         if (response.getStatusCode() == HttpStatus.OK) {
             JSONObject jsonResponse = new JSONObject(response.getBody());
             
             if (!jsonResponse.has("output")) {
                 logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                 return null;
             }
             
             JSONObject outputObj = jsonResponse.getJSONObject("output");
             
             StockInfo stock = new StockInfo(
                 outputObj.getString("stck_shrn_iscd"), // 종목 코드
                 name, // 받아온 종목명 사용
                 outputObj.getString("stck_prpr"), // 현재가
                 outputObj.getString("prdy_vrss"), // 대비
                 outputObj.getString("prdy_ctrt"), // 등락률
                 outputObj.getString("acml_vol"), // 거래량
                 "KRX" // 거래소 코드
             );
             
             stock.setPositiveChange(outputObj.getString("prdy_vrss_sign").equals("2") ||
                                    outputObj.getString("prdy_vrss_sign").equals("1"));
             
             return stock;
         } else {
             logger.warning("코드 " + code + " 조회 실패: " + response.getStatusCode());
             return null;
         }
     } catch (Exception e) {
         logger.warning("국내주식 " + code + " 조회 중 예외 발생: " + e.getMessage());
         return null;
     }
 }
//해외주식 종목코드로 거래소 코드 유추 (추측 기반, 정확한 매핑은 DB 필요)
private String getExchangeCodeForOverseas(String code) {
  // 기본적으로 나스닥 거래소로 가정
  // 실제로는 DB나 별도 매핑 테이블을 통해 정확한 거래소 코드 반환 필요
  return "NAS";
}

 // 해외주식 정보 조회 메서드
 private StockInfo getOverseasStockInfo(String token, String code, String name, String exchangeCode) {
     try {
         // 해외주식 시세 조회 API 호출
         String url = apiUrl + "/uapi/overseas-price/v1/quotations/price";
         
         
         UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
             .queryParam("AUTH", "")
             .queryParam("EXCD", exchangeCode) // 거래소 코드 (NAS, NYS 등)
             .queryParam("SYMB", code);        // 종목 코드
         
         HttpHeaders headers = new HttpHeaders();
         headers.setContentType(MediaType.APPLICATION_JSON);
         headers.set("authorization", "Bearer " + token);
         headers.set("appkey", appKey);
         headers.set("appsecret", appSecret);
         headers.set("tr_id", "HHDFS00000300"); // 해외주식 현재가 시세 TR ID
         headers.set("custtype", "P");
         
         HttpEntity<String> requestEntity = new HttpEntity<>(headers);
         
         ResponseEntity<String> response = restTemplate.exchange(
             builder.toUriString(),
             HttpMethod.GET,
             requestEntity,
             String.class
         );
         
         if (response.getStatusCode() == HttpStatus.OK) {
             JSONObject jsonResponse = new JSONObject(response.getBody());
             
             if (!jsonResponse.has("output")) {
                 logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                 return null;
             }
             
             JSONObject outputObj = jsonResponse.getJSONObject("output");
             
             // API 응답에서 필요한 정보 추출하되, 해외주식 API는 응답 필드명이 다름
             StockInfo stock = new StockInfo(
                 code, // 종목 코드
                 name, // 받아온 종목명 사용
                 outputObj.getString("last"), // 현재가
                 outputObj.getString("diff"), // 대비
                 outputObj.getString("rate"), // 등락률
                 outputObj.getString("tvol"), // 거래량
                 exchangeCode // 거래소 코드
             );
             
             // sign 값에 따라 상승/하락 설정 (1,2: 상승, 4,5: 하락)
             String sign = outputObj.getString("sign");
             stock.setPositiveChange(sign.equals("1") || sign.equals("2"));
             
             return stock;
         } else {
             logger.warning("코드 " + code + " 조회 실패: " + response.getStatusCode());
             return null;
         }
     } catch (Exception e) {
         logger.warning("해외주식 " + code + " 조회 중 예외 발생: " + e.getMessage());
         return null;
     }
 }
    
    /**
     * 토큰을 파일에서 로드합니다.
     */
    private void loadTokenFromFile() {
        try {
            if (Files.exists(Paths.get(TOKEN_FILE_PATH))) {
                Properties props = new Properties();
                try (FileInputStream fis = new FileInputStream(TOKEN_FILE_PATH)) {
                    props.load(fis);
                    accessToken = props.getProperty("access_token");
                    String expirationTimeStr = props.getProperty("expiration_time");
                    if (expirationTimeStr != null) {
                        tokenExpirationTime = Long.parseLong(expirationTimeStr);
                    }
                    
                    logger.info("저장된 토큰 로드 완료. 만료까지 " + 
                               ((tokenExpirationTime - System.currentTimeMillis()) / 1000 / 60) + "분 남음");
                }
            }
        } catch (Exception e) {
            logger.warning("토큰 파일 로드 실패: " + e.getMessage());
            // 실패해도 계속 진행 - 새 토큰을 발급받을 것임
        }
    }
    
    /**
     * 토큰을 파일에 저장합니다.
     */
    private void saveTokenToFile() {
        try {
            Properties props = new Properties();
            props.setProperty("access_token", accessToken);
            props.setProperty("expiration_time", String.valueOf(tokenExpirationTime));
            
            try (FileOutputStream fos = new FileOutputStream(TOKEN_FILE_PATH)) {
                props.store(fos, "KIS API Token");
                logger.info("토큰 파일 저장 완료");
            }
        } catch (Exception e) {
            logger.warning("토큰 파일 저장 실패: " + e.getMessage());
            // 실패해도 계속 진행 - 메모리에는 토큰이 있음
        }
    }
    
    /**
     * 토큰이 유효한지 확인합니다.
     * @return 토큰 유효 여부
     */
    private boolean isTokenValid() {
        return accessToken != null && System.currentTimeMillis() < tokenExpirationTime;
    }
    
    /**
     * 토큰을 발급받거나 캐시된 토큰을 반환합니다.
     * @return 액세스 토큰
     */
    private String getToken() {
        // 토큰이 유효하면 기존 토큰 반환
        if (isTokenValid()) {
            logger.info("캐시된 토큰 사용. 만료까지 " + 
                       ((tokenExpirationTime - System.currentTimeMillis()) / 1000 / 60) + "분 남음");
            return accessToken;
        }
        
        // 새 토큰 발급이 필요한 경우
        try {
            logger.info("새 토큰 발급 시도...");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("grant_type", "client_credentials");
            requestBody.put("appkey", appKey);
            requestBody.put("appsecret", appSecret);
            
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/oauth2/tokenP",
                HttpMethod.POST,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                accessToken = jsonResponse.getString("access_token");
                int expiresIn = jsonResponse.getInt("expires_in");
                
                // 토큰 만료 시간 설정 (현재 시간 + 만료 시간(초) - 안전 마진(10분))
                tokenExpirationTime = System.currentTimeMillis() + (expiresIn * 1000L) - (10 * 60 * 1000L);
                
                // 토큰을 파일에 저장
                saveTokenToFile();
                
                logger.info("새 토큰 발급 완료. 유효 기간: " + (expiresIn / 60 / 60) + "시간");
                return accessToken;
            } else {
                throw new RuntimeException("토큰 발급 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.severe("토큰 발급 중 오류 발생: " + e.getMessage());
            
            // 토큰 발급 실패 시 대체 함수 사용 여부를 알리기 위해 null 반환
            return null;
        }
    }
    
    
    
    /**
     * 국내 주식 거래량 상위 30개 종목을 조회합니다.
     */
    public List<StockInfo> getDomesticVolumeRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 국내 주식 데이터 반환");
                return getFallbackDomesticStocks();
            }
            
            // 요청 URL 및 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/quotations/volume-rank";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                .queryParam("FID_COND_SCR_DIV_CODE", "20171")
                .queryParam("FID_INPUT_ISCD", "0000") // 전체
                .queryParam("FID_DIV_CLS_CODE", "0")  // 전체
                .queryParam("FID_BLNG_CLS_CODE", "0") // 전체
                .queryParam("FID_TRGT_CLS_CODE", "111111111")
                .queryParam("FID_TRGT_EXLS_CLS_CODE", "0000000000")
                .queryParam("FID_INPUT_PRICE_1", "0")
                .queryParam("FID_INPUT_PRICE_2", "999999999")
                .queryParam("FID_VOL_CNT", "0")
                .queryParam("FID_INPUT_DATE_1", "");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01710000");  // 거래량 상위 종목 조회 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("국내 주식 거래량 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                // 응답 구조 확인
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    return getFallbackDomesticStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                List<StockInfo> stocks = new ArrayList<>();
                
                // 최대 30개만 처리
                int limit = Math.min(stockArray.length(), 30);
                
                for (int i = 0; i < limit; i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("mksc_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_vol"),        // 거래량
                        "KRX"                                  // 거래소 코드
                    );
                    
                    // 추가 정보 설정 (필요한 경우)
                    stock.setRank(i + 1);
                    stock.setPositiveChange(stockJson.getString("prdy_vrss_sign").equals("2") || 
                                            stockJson.getString("prdy_vrss_sign").equals("1"));
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("국내 주식 거래량 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 주식 데이터 반환: " + e.getMessage());
            return getFallbackDomesticStocks();
        }
    }
    
    /**
     * 국내 주식 거래대금 상위 30개 종목을 조회합니다.
     */
    public List<StockInfo> getDomesticTradeValueRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 국내 주식 데이터 반환");
                return getFallbackDomesticStocks();
            }
            
            // 요청 URL 및 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/quotations/volume-rank";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                .queryParam("FID_COND_SCR_DIV_CODE", "20171")
                .queryParam("FID_INPUT_ISCD", "0000") // 전체
                .queryParam("FID_DIV_CLS_CODE", "0")  // 전체
                .queryParam("FID_BLNG_CLS_CODE", "3") // 거래금액순
                .queryParam("FID_TRGT_CLS_CODE", "111111111")
                .queryParam("FID_TRGT_EXLS_CLS_CODE", "0000000000")
                .queryParam("FID_INPUT_PRICE_1", "0")
                .queryParam("FID_INPUT_PRICE_2", "999999999")
                .queryParam("FID_VOL_CNT", "0")
                .queryParam("FID_INPUT_DATE_1", "");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01710000");
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("국내 주식 거래대금 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    return getFallbackDomesticStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                List<StockInfo> stocks = new ArrayList<>();
                
                int limit = Math.min(stockArray.length(), 30);
                
                for (int i = 0; i < limit; i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("mksc_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_tr_pbmn"),    // 거래대금
                        "KRX"                                  // 거래소 코드
                    );
                    
                    stock.setRank(i + 1);
                    stock.setPositiveChange(stockJson.getString("prdy_vrss_sign").equals("2") || 
                                            stockJson.getString("prdy_vrss_sign").equals("1"));
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("국내 주식 거래대금 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 주식 데이터 반환: " + e.getMessage());
            return getFallbackDomesticStocks();
        }
    }
    
    /**
     * 국내 주식 급상승 30개 종목을 조회합니다.
     */
    public List<StockInfo> getDomesticRisingRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 국내 주식 데이터 반환");
                return getFallbackDomesticStocks();
            }
            
            // 요청 URL 및 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/ranking/fluctuation";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("fid_cond_mrkt_div_code", "J")     // 시장구분코드 (주식 J)
                .queryParam("fid_cond_scr_div_code", "20170")  // Unique key
                .queryParam("fid_input_iscd", "0000")          // 전체 종목
                .queryParam("fid_rank_sort_cls_code", "0")     // 상승율순
                .queryParam("fid_input_cnt_1", "0")            // 전체
                .queryParam("fid_prc_cls_code", "1")           // 전체
                .queryParam("fid_input_price_1", "")           // 전체
                .queryParam("fid_input_price_2", "")           // 전체
                .queryParam("fid_vol_cnt", "")                 // 전체
                .queryParam("fid_trgt_cls_code", "0")          // 전체
                .queryParam("fid_trgt_exls_cls_code", "0")     // 전체
                .queryParam("fid_div_cls_code", "0")           // 전체
                .queryParam("fid_rsfl_rate1", "")              // 전체
                .queryParam("fid_rsfl_rate2", "");             // 전체
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01700000");  // 등락률 순위 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("국내 주식 급상승 종목 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    return getFallbackDomesticStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                List<StockInfo> stocks = new ArrayList<>();
                
                int limit = Math.min(stockArray.length(), 30);
                
                for (int i = 0; i < limit; i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("stck_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_vol"),        // 거래량
                        "KRX"                                  // 거래소 코드
                    );
                    
                    stock.setRank(i + 1);
                    stock.setPositiveChange(stockJson.getString("prdy_vrss_sign").equals("2") || 
                                            stockJson.getString("prdy_vrss_sign").equals("1"));
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("국내 주식 급상승 종목 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 주식 데이터 반환: " + e.getMessage());
            return getFallbackDomesticStocks();
        }
    }
    
    /**
     * 국내 주식 급하락 30개 종목을 조회합니다.
     */
    public List<StockInfo> getDomesticFallingRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 국내 주식 데이터 반환");
                return getFallbackDomesticStocks();
            }
            
            // 요청 URL 및 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/ranking/fluctuation";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("fid_cond_mrkt_div_code", "J")     // 시장구분코드 (주식 J)
                .queryParam("fid_cond_scr_div_code", "20170")  // Unique key
                .queryParam("fid_input_iscd", "0000")          // 전체 종목
                .queryParam("fid_rank_sort_cls_code", "1")     // 하락율순
                .queryParam("fid_input_cnt_1", "0")            // 전체
                .queryParam("fid_prc_cls_code", "1")           // 전체
                .queryParam("fid_input_price_1", "")           // 전체
                .queryParam("fid_input_price_2", "")           // 전체
                .queryParam("fid_vol_cnt", "")                 // 전체
                .queryParam("fid_trgt_cls_code", "0")          // 전체
                .queryParam("fid_trgt_exls_cls_code", "0")     // 전체
                .queryParam("fid_div_cls_code", "0")           // 전체
                .queryParam("fid_rsfl_rate1", "")              // 전체
                .queryParam("fid_rsfl_rate2", "");             // 전체
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01700000");  // 등락률 순위 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("국내 주식 급하락 종목 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    return getFallbackDomesticStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                List<StockInfo> stocks = new ArrayList<>();
                
                int limit = Math.min(stockArray.length(), 30);
                
                for (int i = 0; i < limit; i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("stck_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_vol"),        // 거래량
                        "KRX"                                  // 거래소 코드
                    );
                    
                    stock.setRank(i + 1);
                    stock.setPositiveChange(stockJson.getString("prdy_vrss_sign").equals("2") || 
                                            stockJson.getString("prdy_vrss_sign").equals("1"));
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("국내 주식 급하락 종목 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 주식 데이터 반환: " + e.getMessage());
            return getFallbackDomesticStocks();
        }
    }
    
    
    /**
     * 국내 주식 목록을 API에서 조회합니다.
     * API 호출이 실패하면 정적 데이터를 반환합니다.
     * 
     * @return 국내 주식 정보 목록
     */
    public List<StockInfo> getDomesticStocks() {
        try {
            String token = getToken();
            if (token == null) {
                // 토큰 발급 실패 시 정적 데이터 반환
                logger.warning("토큰 발급 실패로 정적 국내 주식 데이터 반환");
                return getFallbackDomesticStocks();
            }
            
            // 요청 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/quotations/volume-rank";
            
            // 파라미터를 쿼리 스트링으로 구성
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                .queryParam("FID_COND_SCR_DIV_CODE", "20171")
                .queryParam("FID_INPUT_ISCD", "0000")
                .queryParam("FID_DIV_CLS_CODE", "0")
                .queryParam("FID_BLNG_CLS_CODE", "0")
                .queryParam("FID_TRGT_CLS_CODE", "111111111")
                .queryParam("FID_TRGT_EXLS_CLS_CODE", "0000000000")
                .queryParam("FID_INPUT_PRICE_1", "0")
                .queryParam("FID_INPUT_PRICE_2", "0")
                .queryParam("FID_VOL_CNT", "0")
                .queryParam("FID_INPUT_DATE_1", "0");
            
            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01710000");  // 거래량 상위 종목 조회 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            // API 호출
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            List<StockInfo> stocks = new ArrayList<>();
            
            if (response.getStatusCode() == HttpStatus.OK) {
                // 디버깅을 위해 전체 응답 출력
                logger.info("API 응답: " + response.getBody());
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                // output 필드가 있는지 확인
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다. 응답: " + response.getBody());
                    return getFallbackDomesticStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("mksc_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_vol"),        // 거래량
                        "KRX"                                  // 거래소 코드
                    );
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("국내 주식 데이터 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 주식 데이터 반환: " + e.getMessage());
            return getFallbackDomesticStocks();
        }
    }
    
 // StockApiService.java

    /**
     * 미국 주식 거래량 상위 종목 조회
     */
    public List<StockInfo> getOverseasVolumeRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 미국 주식 데이터 반환");
                return getFallbackOverseasStocks();
            }
            
            // 미국 주식 거래량 상위 조회 API URL
            String url = apiUrl + "/uapi/overseas-stock/v1/ranking/trade-vol";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("EXCD", "NAS") // 나스닥 거래소 - 필요에 따라 변경 가능
                .queryParam("CNT", "30");  // 최대 30개 데이터 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "HHDFS76310010"); // 해외주식 거래량 상위 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("미국 주식 거래량 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                // output1은 응답 헤더, output2는 응답 바디 데이터
                if (!jsonResponse.has("output2")) {
                    logger.warning("API 응답에 'output2' 필드가 없습니다: " + response.getBody());
                    return getFallbackOverseasStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output2");
                List<StockInfo> stocks = new ArrayList<>();
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    // API 응답의 필드명은 실제 API 문서를 참고하여 조정 필요
                    StockInfo stock = new StockInfo(
                        stockJson.getString("symb"),        // 종목 코드
                        stockJson.getString("name"),        // 종목명
                        stockJson.getString("last"),        // 현재가
                        stockJson.getString("diff"),        // 대비
                        stockJson.getString("rate"),        // 등락률
                        stockJson.getString("tvol"),        // 거래량
                        "NAS"                              // 거래소 코드
                    );
                    
                    // 추가 정보 설정
                    stock.setRank(i + 1);
                    stock.setPositiveChange(!stockJson.getString("sign").equals("5") && 
                                           !stockJson.getString("sign").equals("4"));
                    stock.setExchangeCode("NAS"); // 거래소 코드 설정
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("미국 주식 거래량 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 미국 주식 데이터 반환: " + e.getMessage());
            return getFallbackOverseasStocks();
        }
    }

    /**
     * 미국 주식 급상승 종목 조회
     */
    public List<StockInfo> getOverseasRisingRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 미국 주식 데이터 반환");
                return getFallbackOverseasStocks();
            }
            
            // 미국 주식 급상승 상위 조회 API URL
            String url = apiUrl + "/uapi/overseas-stock/v1/ranking/updown-rate";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("EXCD", "NAS") // 나스닥 거래소 - 필요에 따라 변경 가능
                .queryParam("CNT", "30");  // 최대 30개 데이터 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "HHDFS76290000"); // 해외주식 상승률 상위 TR ID
            headers.set("custtype", "P");
            headers.set("GUBN", "1");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("미국 주식 급상승 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output2")) {
                    logger.warning("API 응답에 'output2' 필드가 없습니다: " + response.getBody());
                    return getFallbackOverseasStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output2");
                List<StockInfo> stocks = new ArrayList<>();
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("symb"),        // 종목 코드
                        stockJson.getString("name"),        // 종목명
                        stockJson.getString("last"),        // 현재가
                        stockJson.getString("diff"),        // 대비
                        stockJson.getString("rate"),        // 등락률
                        stockJson.getString("tvol"),        // 거래량
                        "NAS"                              // 거래소 코드
                    );
                    
                    stock.setRank(i + 1);
                    stock.setPositiveChange(true); // 급상승이므로 무조건 상승
                    stock.setExchangeCode("NAS"); // 거래소 코드 설정
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("미국 주식 급상승 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 미국 주식 데이터 반환: " + e.getMessage());
            return getFallbackOverseasStocks();
        }
    }
    /**
     * 미국 주식 거래대금 상위 종목 조회
     */
    public List<StockInfo> getOverseasTradeValueRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 미국 주식 데이터 반환");
                return getFallbackOverseasStocks();
            }
            
            // 미국 주식 거래대금 상위 조회 API URL
            // 거래대금 전용 API가 없는 경우 거래량 API와 동일하게 사용하고 정렬 처리
            String url = apiUrl + "/uapi/overseas-stock/v1/ranking/trade-pbmn";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("EXCD", "NAS") // 나스닥 거래소 - 필요에 따라 변경 가능
                .queryParam("CNT", "30");  // 최대 30개 데이터 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "HHDFS76320010"); // 해외주식 거래량 상위 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("미국 주식 거래대금 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output2")) {
                    logger.warning("API 응답에 'output2' 필드가 없습니다: " + response.getBody());
                    return getFallbackOverseasStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output2");
                List<StockInfo> stocks = new ArrayList<>();
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("symb"),        // 종목 코드
                        stockJson.getString("name"),        // 종목명
                        stockJson.getString("last"),        // 현재가
                        stockJson.getString("diff"),        // 대비
                        stockJson.getString("rate"),        // 등락률
                        stockJson.getString("tvol"),        // 거래량
                        "NAS"                              // 거래소 코드
                    );
                    
                    // 추가 정보 설정
                    stock.setRank(i + 1);
                    stock.setPositiveChange(!stockJson.getString("sign").equals("5") && 
                                           !stockJson.getString("sign").equals("4"));
                    stock.setExchangeCode("NAS"); // 거래소 코드 설정
                    
                    // 거래대금 설정 (API 응답에 거래대금 필드가 있는 경우 - 없으면 계산)
                    if (stockJson.has("aamt")) {
                        stock.setTradingValue(stockJson.getString("aamt")); // 거래대금
                    } else {
                        // 거래대금 필드가 없는 경우, 거래량 * 현재가로 추정
                        double volume = Double.parseDouble(stockJson.getString("tvol").replace(",", ""));
                        double price = Double.parseDouble(stockJson.getString("last").replace(",", ""));
                        String tradingValue = String.format("%.0f", volume * price);
                        stock.setTradingValue(tradingValue);
                    }
                    
                    stocks.add(stock);
                }
                
                // 거래대금 기준으로 정렬 (내림차순)
                stocks.sort((a, b) -> {
                    double valueA = Double.parseDouble(a.getTradingValue().replace(",", ""));
                    double valueB = Double.parseDouble(b.getTradingValue().replace(",", ""));
                    return Double.compare(valueB, valueA); // 내림차순 정렬
                });
                
                // 랭크 재설정
                for (int i = 0; i < stocks.size(); i++) {
                    stocks.get(i).setRank(i + 1);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("미국 주식 거래대금 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 미국 주식 데이터 반환: " + e.getMessage());
            return getFallbackOverseasStocks();
        }
    }
    /**
     * 미국 주식 급하락 종목 조회
     */
    public List<StockInfo> getOverseasFallingRanking() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 미국 주식 데이터 반환");
                return getFallbackOverseasStocks();
            }
            
            // 미국 주식 급하락 상위 조회 API URL
            String url = apiUrl + "/uapi/overseas-stock/v1/ranking/updown-rate";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("EXCD", "NAS") // 나스닥 거래소 - 필요에 따라 변경 가능
                .queryParam("CNT", "30");  // 최대 30개 데이터 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "HHDFS76290000"); // 해외주식 하락률 상위 TR ID
            headers.set("custtype", "P");
            headers.set("GUBN", "0");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("미국 주식 급하락 상위 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output2")) {
                    logger.warning("API 응답에 'output2' 필드가 없습니다: " + response.getBody());
                    return getFallbackOverseasStocks();
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output2");
                List<StockInfo> stocks = new ArrayList<>();
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("symb"),        // 종목 코드
                        stockJson.getString("name"),        // 종목명
                        stockJson.getString("last"),        // 현재가
                        stockJson.getString("diff"),        // 대비
                        stockJson.getString("rate"),        // 등락률
                        stockJson.getString("tvol"),        // 거래량
                        "NAS"                              // 거래소 코드
                    );
                    
                    stock.setRank(i + 1);
                    stock.setPositiveChange(false); // 급하락이므로 무조건 하락
                    stock.setExchangeCode("NAS"); // 거래소 코드 설정
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("미국 주식 급하락 상위 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 미국 주식 데이터 반환: " + e.getMessage());
            return getFallbackOverseasStocks();
        }
    }
    
    /**
     * 해외 주식 목록을 API에서 조회합니다.
     * API 호출이 실패하면 정적 데이터를 반환합니다.
     * 
     * @return 해외 주식 정보 목록
     */
    public List<StockInfo> getOverseasStocks() {
        try {
            String token = getToken();
            if (token == null) {
                // 토큰 발급 실패 시 정적 데이터 반환
                logger.warning("토큰 발급 실패로 정적 해외 주식 데이터 반환");
                return getFallbackOverseasStocks();
            }
            
            // API URL 및 파라미터 설정
            String url = apiUrl + "/uapi/overseas-stock/v1/ranking/trade-vol" +
                    "?EXCD=NAS" +      // 나스닥 거래소
                    "&NDAYN=0" +        // 당일 데이터
                    "&PRC1=0" +         // 최소 가격
                    "&PRC2=999999" +    // 최대 가격
                    "&VOL_RANG=0" +     // 전체 거래량 조건
                    "&KEYB=";           // 초기 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "HHDFS76310010");  // 거래량 상위 종목 조회 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            // API 호출
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            List<StockInfo> stocks = new ArrayList<>();
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray stockArray = jsonResponse.getJSONArray("output2");
                
                for (int i = 0; i < stockArray.length(); i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("symb"),         // 종목 코드
                        stockJson.getString("name"),         // 종목명
                        stockJson.getString("last"),         // 현재가
                        stockJson.getString("diff"),         // 대비
                        stockJson.getString("rate"),         // 등락률
                        stockJson.getString("tvol"),         // 거래량
                        "NAS"                               // 거래소 코드
                    );
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("해외 주식 데이터 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 해외 주식 데이터 반환: " + e.getMessage());
            return getFallbackOverseasStocks();
        }
    }
    
    /**
     * 국내 주식 정적 데이터를 생성합니다.
     * API 호출이 실패했을 때 대체 데이터로 사용됩니다.
     * 
     * @return 국내 주식 정적 데이터
     */
    private List<StockInfo> getFallbackDomesticStocks() {
        logger.info("국내 주식 정적 데이터 생성 중...");
        List<StockInfo> stocks = new ArrayList<>();
        
        // 현재 시간을 포맷팅하여 데이터가 새로 생성되었음을 표시
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd HH:mm");
        String now = sdf.format(new Date());
        
        // 주요 국내 주식 정보 추가
        stocks.add(new StockInfo("005930", "삼성전자 (정적 " + now + ")", "72,500", "+500", "+0.69", "12,345,678", "KRX"));
        stocks.add(new StockInfo("000660", "SK하이닉스 (정적 " + now + ")", "128,500", "+1,500", "+1.18", "3,456,789", "KRX"));
        stocks.add(new StockInfo("035420", "NAVER (정적 " + now + ")", "253,000", "-2,000", "-0.78", "1,234,567", "KRX"));
        stocks.add(new StockInfo("051910", "LG화학 (정적 " + now + ")", "498,000", "+8,000", "+1.63", "456,789", "KRX"));
        stocks.add(new StockInfo("035720", "카카오 (정적 " + now + ")", "62,300", "-700", "-1.11", "2,345,678", "KRX"));
        stocks.add(new StockInfo("006400", "삼성SDI (정적 " + now + ")", "420,000", "+5,000", "+1.20", "567,890", "KRX"));
        stocks.add(new StockInfo("207940", "삼성바이오로직스 (정적 " + now + ")", "780,000", "-12,000", "-1.52", "123,456", "KRX"));
        stocks.add(new StockInfo("068270", "셀트리온 (정적 " + now + ")", "153,000", "+2,500", "+1.66", "789,012", "KRX"));
        stocks.add(new StockInfo("005380", "현대차 (정적 " + now + ")", "187,000", "-1,500", "-0.80", "345,678", "KRX"));
        stocks.add(new StockInfo("373220", "LG에너지솔루션 (정적 " + now + ")", "430,000", "+7,000", "+1.65", "234,567", "KRX"));
        
        logger.info("국내 주식 정적 데이터 생성 완료: " + stocks.size() + "개 종목");
        return stocks;
    }
    
    /**
     * 해외 주식 정적 데이터를 생성합니다.
     * API 호출이 실패했을 때 대체 데이터로 사용됩니다.
     * 
     * @return 해외 주식 정적 데이터
     */
    private List<StockInfo> getFallbackOverseasStocks() {
        logger.info("해외 주식 정적 데이터 생성 중...");
        List<StockInfo> stocks = new ArrayList<>();
        
        // 현재 시간을 포맷팅하여 데이터가 새로 생성되었음을 표시
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd HH:mm");
        String now = sdf.format(new Date());
        
        // 주요 해외 주식 정보 추가
        stocks.add(new StockInfo("AAPL", "Apple Inc. (정적 " + now + ")", "180.00", "+2.50", "+1.41", "25,678,901", "NAS"));
        stocks.add(new StockInfo("MSFT", "Microsoft (정적 " + now + ")", "330.00", "+5.25", "+1.62", "15,432,897", "NAS"));
        stocks.add(new StockInfo("AMZN", "Amazon (정적 " + now + ")", "178.00", "-3.45", "-1.90", "12,345,678", "NAS"));
        stocks.add(new StockInfo("TSLA", "Tesla (정적 " + now + ")", "175.00", "+7.50", "+4.48", "30,987,654", "NAS"));
        stocks.add(new StockInfo("NVDA", "NVIDIA (정적 " + now + ")", "875.00", "+12.75", "+1.48", "28,765,432", "NAS"));
        stocks.add(new StockInfo("GOOG", "Alphabet (Google) (정적 " + now + ")", "147.00", "-1.25", "-0.84", "9,876,543", "NAS"));
        stocks.add(new StockInfo("META", "Meta Platforms (정적 " + now + ")", "480.00", "+9.50", "+2.02", "14,523,698", "NAS"));
        stocks.add(new StockInfo("NFLX", "Netflix (정적 " + now + ")", "610.00", "+15.75", "+2.65", "7,654,321", "NAS"));
        stocks.add(new StockInfo("AMD", "AMD (정적 " + now + ")", "160.00", "-2.80", "-1.72", "11,234,567", "NAS"));
        stocks.add(new StockInfo("INTC", "Intel (정적 " + now + ")", "43.00", "+0.75", "+1.78", "10,234,567", "NAS"));
        
        logger.info("해외 주식 정적 데이터 생성 완료: " + stocks.size() + "개 종목");
        return stocks;
    }
    

    /**
     * 인기 주식 목록을 API에서 조회합니다.
     * 한국투자증권 관심종목등록 상위 API를 사용합니다.
     * 
     * @return 인기 주식 정보 목록
     */
    public List<StockInfo> getPopularStocks() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 인기 주식 데이터 반환");
                throw new RuntimeException("토큰 발급 실패로 정적 인기 주식 데이터 반환");
            }
            
            // 요청 URL 및 파라미터 설정
            String url = apiUrl + "/uapi/domestic-stock/v1/ranking/top-interest-stock";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("fid_cond_mrkt_div_code", "J")          // 시장구분코드 (주식 J)
                .queryParam("fid_cond_scr_div_code", "20180")       // 화면 분류 코드
                .queryParam("fid_input_iscd", "0000")               // 전체 종목
                .queryParam("fid_trgt_cls_code", "0")               // 대상 구분 코드
                .queryParam("fid_trgt_exls_cls_code", "0")          // 대상 제외 구분 코드
                .queryParam("fid_input_price_1", "")                // 가격 조건 없음
                .queryParam("fid_input_price_2", "")                // 가격 조건 없음
                .queryParam("fid_vol_cnt", "")                      // 거래량 조건 없음
                .queryParam("fid_div_cls_code", "0")                // 종목 분류 (전체)
                .queryParam("fid_input_iscd_2", "000000")           // 필수값
                .queryParam("fid_input_cnt_1", "1");                // 1위부터 조회
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01800000");  // 관심종목등록 상위 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("인기 주식 조회 성공");
                
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                // 응답 구조 확인
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    throw new RuntimeException("인기 주식 응답 구조 에러 " + response.getStatusCode());
                }
                
                JSONArray stockArray = jsonResponse.getJSONArray("output");
                List<StockInfo> stocks = new ArrayList<>();
                
                // 최대 30개만 처리 (API 문서 상 최대 30건)
                int limit = Math.min(stockArray.length(), 10);
                
                for (int i = 0; i < limit; i++) {
                    JSONObject stockJson = stockArray.getJSONObject(i);
                    
                    StockInfo stock = new StockInfo(
                        stockJson.getString("mksc_shrn_iscd"),  // 종목 코드
                        stockJson.getString("hts_kor_isnm"),    // 종목명
                        stockJson.getString("stck_prpr"),       // 현재가
                        stockJson.getString("prdy_vrss"),       // 대비
                        stockJson.getString("prdy_ctrt"),       // 등락률
                        stockJson.getString("acml_vol"),        // 거래량
                        "KRX"                                  // 거래소 코드
                    );
                    
                    // 추가 정보 설정 - 순위와 상승/하락 여부
                    stock.setRank(Integer.parseInt(stockJson.getString("data_rank")));
                    stock.setPositiveChange(stockJson.getString("prdy_vrss_sign").equals("2") || 
                                           stockJson.getString("prdy_vrss_sign").equals("1"));
                    
                    stocks.add(stock);
                }
                
                return stocks;
            } else {
                throw new RuntimeException("인기 주식 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 인기 주식 데이터 반환: " + e.getMessage());
            throw new RuntimeException("API 호출 실패로 정적 인기 주식 데이터 반환 실패: ");
        }
    }
    
    /**
     * 국내 주요 지수 정보를 가져옵니다. (코스피, 코스닥)
     */
    public List<IndexInfo> getDomesticIndices() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 국내 지수 데이터 반환");
                return getFallbackDomesticIndices();
            }
            
            List<IndexInfo> indices = new ArrayList<>();
            
            // 코스피 지수 조회 (0001)
            IndexInfo kospi = getIndexInfo(token, "0001", "코스피");
            if (kospi != null) {
                indices.add(kospi);
            }
            
            // 코스닥 지수 조회 (1001)
            IndexInfo kosdaq = getIndexInfo(token, "1001", "코스닥");
            if (kosdaq != null) {
                indices.add(kosdaq);
            }
            
            return indices;
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 국내 지수 데이터 반환: " + e.getMessage());
            return getFallbackDomesticIndices();
        }
    }

    /**
     * 개별 지수 정보를 조회합니다.
     */
    private IndexInfo getIndexInfo(String token, String indexCode, String indexName) {
        try {
            String url = apiUrl + "/uapi/domestic-stock/v1/quotations/inquire-index-price";
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("FID_COND_MRKT_DIV_CODE", "U")  // 업종(U)
                .queryParam("FID_INPUT_ISCD", indexCode);   // 코스피(0001), 코스닥(1001) 등
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPUP02100000");  // 국내업종 현재지수 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output")) {
                    logger.warning("API 응답에 'output' 필드가 없습니다: " + response.getBody());
                    return null;
                }
                
                JSONObject outputObj = jsonResponse.getJSONObject("output");
                
                // 지수 정보 생성
                IndexInfo index = new IndexInfo();
                index.setName(indexName);
                index.setValue(outputObj.getString("bstp_nmix_prpr"));
                index.setChange(outputObj.getString("bstp_nmix_prdy_vrss"));
                index.setChangeRate(outputObj.getString("bstp_nmix_prdy_ctrt"));
                
                // 부호에 따라 상승/하락 설정 (1: 상한, 2: 상승, 3: 보합, 4: 하락, 5: 하한)
                String sign = outputObj.getString("prdy_vrss_sign");
                index.setNegative(sign.equals("4") || sign.equals("5"));
                
                return index;
            } else {
                logger.warning("지수 " + indexCode + " 조회 실패: " + response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            logger.warning("지수 " + indexCode + " 조회 중 예외 발생: " + e.getMessage());
            return null;
        }
    }

    /**
     * 해외 주요 지수 정보를 가져옵니다. (다우존스, 나스닥, S&P 500)
     */
    public List<IndexInfo> getOverseasIndices() {
        try {
            String token = getToken();
            if (token == null) {
                logger.warning("토큰 발급 실패로 정적 해외 지수 데이터 반환");
                return getFallbackOverseasIndices();
            }
            
            List<IndexInfo> indices = new ArrayList<>();
            
            // 다우존스 지수 조회
            IndexInfo dow = getOverseasIndexInfo(token, ".DJI", "다우존스");
            if (dow != null) {
                indices.add(dow);
            }
            
            // 나스닥 지수 조회
            IndexInfo nasdaq = getOverseasIndexInfo(token, "NDX", "나스닥");

            if (nasdaq != null) {
                indices.add(nasdaq);
            }
            
            // S&P 500 지수 조회
            IndexInfo snp = getOverseasIndexInfo(token, "SPX", "S&P 500");
            if (snp != null) {
                indices.add(snp);
            }
            
            return indices;
        } catch (Exception e) {
            logger.warning("API 호출 실패로 정적 해외 지수 데이터 반환: " + e.getMessage());
            return getFallbackOverseasIndices();
        }
    }

    /**
     * 개별 해외 지수 정보를 조회합니다.
     */
    private IndexInfo getOverseasIndexInfo(String token, String indexCode, String indexName) {
        try {
            String url = apiUrl + "/uapi/overseas-price/v1/quotations/inquire-daily-chartprice";
            
            // 오늘 날짜와 어제 날짜 계산
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            Calendar cal = Calendar.getInstance();
            String today = sdf.format(cal.getTime());
            cal.add(Calendar.DATE, -7); // 일주일 전 (주말/공휴일 고려)
            String sevenDaysAgo = sdf.format(cal.getTime());
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("FID_COND_MRKT_DIV_CODE", "N")  // 해외지수(N)
                .queryParam("FID_INPUT_ISCD", indexCode)    // 다우(.DJI), 나스닥(.IXIC), S&P 500(.SPX)
                .queryParam("FID_INPUT_DATE_1", sevenDaysAgo) // 시작일
                .queryParam("FID_INPUT_DATE_2", today)      // 종료일
                .queryParam("FID_PERIOD_DIV_CODE", "D");    // 일봉
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", "Bearer " + token);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHKST03030100");  // 해외지수 시세 TR ID
            headers.set("custtype", "P");
            
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                requestEntity,
                String.class
            );
            System.out.println("체크해보자 이녀석은"+indexCode+indexName+response);
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                
                if (!jsonResponse.has("output1")) {
                    logger.warning("API 응답에 'output1' 필드가 없습니다: " + response.getBody());
                    return null;
                }
                
                JSONObject outputObj = jsonResponse.getJSONObject("output1");
                
                // 지수 정보 생성
                IndexInfo index = new IndexInfo();
                index.setName(indexName);
                index.setValue(outputObj.getString("ovrs_nmix_prpr"));
                index.setChange(outputObj.getString("ovrs_nmix_prdy_vrss"));
                index.setChangeRate(outputObj.getString("prdy_ctrt"));
                
                // 부호에 따라 상승/하락 설정 (1: 상한, 2: 상승, 3: 보합, 4: 하락, 5: 하한)
                String sign = outputObj.getString("prdy_vrss_sign");
                index.setNegative(sign.equals("4") || sign.equals("5"));
                
                return index;
            } else {
                logger.warning("해외 지수 " + indexCode + " 조회 실패: " + response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            logger.warning("해외 지수 " + indexCode + " 조회 중 예외 발생: " + e.getMessage());
            return null;
        }
    }

    /**
     * 정적 국내 지수 데이터를 반환합니다.
     */
    private List<IndexInfo> getFallbackDomesticIndices() {
        List<IndexInfo> indices = new ArrayList<>();
        
        IndexInfo kospi = new IndexInfo();
        kospi.setName("코스피");
        kospi.setValue("2,564.22");
        kospi.setChange("+20.34");
        kospi.setChangeRate("0.8");
        kospi.setNegative(false);
        indices.add(kospi);
        
        IndexInfo kosdaq = new IndexInfo();
        kosdaq.setName("코스닥");
        kosdaq.setValue("860.45");
        kosdaq.setChange("-4.32");
        kosdaq.setChangeRate("-0.5");
        kosdaq.setNegative(true);
        indices.add(kosdaq);
        
        return indices;
    }

    /**
     * 정적 해외 지수 데이터를 반환합니다.
     */
    private List<IndexInfo> getFallbackOverseasIndices() {
        List<IndexInfo> indices = new ArrayList<>();
        
        IndexInfo dow = new IndexInfo();
        dow.setName("다우존스");
        dow.setValue("33,921.73");
        dow.setChange("-411.32");
        dow.setChangeRate("-1.2");
        dow.setNegative(true);
        indices.add(dow);
        
        IndexInfo nasdaq = new IndexInfo();
        nasdaq.setName("나스닥");
        nasdaq.setValue("17,251.32");
        nasdaq.setChange("-693.42");
        nasdaq.setChangeRate("-4.0");
        nasdaq.setNegative(true);
        indices.add(nasdaq);
        
        IndexInfo snp = new IndexInfo();
        snp.setName("S&P 500");
        snp.setValue("4,112.55");
        snp.setChange("+87.15");
        snp.setChangeRate("2.1");
        snp.setNegative(false);
        indices.add(snp);
        
        return indices;
    }
    
    
    
}