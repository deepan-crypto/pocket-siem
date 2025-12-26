package com.hackathon.pocketSIEM.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    
    private static final String API_KEY_HEADER = "X-API-KEY";
    private static final String VALID_API_KEY = "pocketsiem-secret-key-2024"; // TODO: Move to config/env
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        
        // Skip API key check for non-API endpoints
        if (!requestPath.startsWith("/api/v1/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String apiKey = request.getHeader(API_KEY_HEADER);
        
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Missing API key for request to: {}", requestPath);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing X-API-KEY header");
            return;
        }
        
        if (!apiKey.equals(VALID_API_KEY)) {
            log.warn("Invalid API key attempt for request to: {}", requestPath);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid API key");
            return;
        }
        
        // Set authentication in security context
        UsernamePasswordAuthenticationToken auth = 
            new UsernamePasswordAuthenticationToken("api-client", null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        filterChain.doFilter(request, response);
    }
}
