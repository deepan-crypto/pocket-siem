import { Platform } from 'react-native';

// Use environment variables from .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || 'your-custom-secret-key-here';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000', 10);

// Default headers for all API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};

/**
 * Fetch wrapper with timeout support using AbortController
 * React Native's fetch doesn't support the timeout option directly
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

export { API_KEY, API_TIMEOUT };
export default API_BASE_URL;
