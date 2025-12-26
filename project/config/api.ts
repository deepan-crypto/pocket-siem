import { Platform } from 'react-native';

// Use environment variables from .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || 'sk-demo-key-12345';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000', 10);

// Default headers for all API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};

export { API_KEY, API_TIMEOUT };
export default API_BASE_URL;
