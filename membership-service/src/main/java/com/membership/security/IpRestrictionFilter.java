package com.membership.security;

import com.membership.entity.Member;
import com.membership.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IpRestrictionFilter extends OncePerRequestFilter {
    
    private final MemberRepository memberRepository;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        String memberId = request.getHeader("X-Member-Id");
        
        if (memberId != null) {
            try {
                Long id = Long.parseLong(memberId);
                Member member = memberRepository.findById(id).orElse(null);
                
                if (member != null && member.getIpWhitelist() != null && member.getIpWhitelist().length > 0) {
                    List<String> allowedIps = Arrays.asList(member.getIpWhitelist());
                    
                    if (!allowedIps.contains(clientIp) && !allowedIps.contains("*")) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write("IP address not allowed");
                        return;
                    }
                }
            } catch (NumberFormatException e) {
                // Invalid member ID, continue with normal flow
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // Multiple IPs can be in X-Forwarded-For header
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
}

