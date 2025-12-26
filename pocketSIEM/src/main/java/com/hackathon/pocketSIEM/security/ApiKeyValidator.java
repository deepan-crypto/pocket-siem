package com.hackathon.pocketSIEM.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyValidator {
    
    @Value("${app.security.api-key:default-api-key-change-in-production}")
    private String validApiKey;
    
    public boolean isValidApiKey(String apiKey) {
        return apiKey != null && apiKey.equals(validApiKey);
    }
}
