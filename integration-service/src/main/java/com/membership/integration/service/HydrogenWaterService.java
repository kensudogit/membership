package com.membership.integration.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HydrogenWaterService {
    
    @Value("${integration.hydrogen-water.api-url:http://localhost:9002}")
    private String apiUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * 水素水サーバーの利用開始
     */
    public Map<String, Object> startUsage(Long memberId, Long deviceId, Integer amount) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("memberId", memberId);
            request.put("deviceId", deviceId);
            request.put("amount", amount);
            request.put("action", "start");
            
            // TODO: 実際の水素水サーバーAPIとの連携
            Map<String, Object> response = restTemplate.postForObject(
                apiUrl + "/usage/start", 
                request, 
                Map.class
            );
            
            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Error starting hydrogen water usage", e);
            throw new RuntimeException("Failed to start hydrogen water usage", e);
        }
    }
    
    /**
     * 水素水サーバーの利用終了
     */
    public Map<String, Object> endUsage(Long memberId, Long deviceId) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("memberId", memberId);
            request.put("deviceId", deviceId);
            request.put("action", "end");
            
            // TODO: 実際の水素水サーバーAPIとの連携
            Map<String, Object> response = restTemplate.postForObject(
                apiUrl + "/usage/end", 
                request, 
                Map.class
            );
            
            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Error ending hydrogen water usage", e);
            throw new RuntimeException("Failed to end hydrogen water usage", e);
        }
    }
    
    /**
     * 水素水サーバーの利用履歴取得
     */
    public Map<String, Object> getUsageHistory(Long memberId) {
        try {
            // TODO: 実際の水素水サーバーAPIとの連携
            return restTemplate.getForObject(
                apiUrl + "/history/" + memberId, 
                Map.class
            );
        } catch (Exception e) {
            log.error("Error getting hydrogen water history", e);
            return new HashMap<>();
        }
    }
}

