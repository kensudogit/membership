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
public class GolfSimulatorService {
    
    @Value("${integration.golf-simulator.api-url:http://localhost:9001}")
    private String apiUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * ゴルフシュミレーターの利用開始
     */
    public Map<String, Object> startSession(Long memberId, Long deviceId) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("memberId", memberId);
            request.put("deviceId", deviceId);
            request.put("action", "start");
            
            // TODO: 実際のゴルフシュミレーターAPIとの連携
            Map<String, Object> response = restTemplate.postForObject(
                apiUrl + "/sessions/start", 
                request, 
                Map.class
            );
            
            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Error starting golf simulator session", e);
            throw new RuntimeException("Failed to start golf simulator session", e);
        }
    }
    
    /**
     * ゴルフシュミレーターの利用終了
     */
    public Map<String, Object> endSession(Long memberId, Long deviceId, Map<String, Object> sessionData) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("memberId", memberId);
            request.put("deviceId", deviceId);
            request.put("action", "end");
            request.put("sessionData", sessionData);
            
            // TODO: 実際のゴルフシュミレーターAPIとの連携
            Map<String, Object> response = restTemplate.postForObject(
                apiUrl + "/sessions/end", 
                request, 
                Map.class
            );
            
            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Error ending golf simulator session", e);
            throw new RuntimeException("Failed to end golf simulator session", e);
        }
    }
    
    /**
     * ゴルフシュミレーターの利用履歴取得
     */
    public Map<String, Object> getUsageHistory(Long memberId) {
        try {
            // TODO: 実際のゴルフシュミレーターAPIとの連携
            return restTemplate.getForObject(
                apiUrl + "/history/" + memberId, 
                Map.class
            );
        } catch (Exception e) {
            log.error("Error getting golf simulator history", e);
            return new HashMap<>();
        }
    }
}

