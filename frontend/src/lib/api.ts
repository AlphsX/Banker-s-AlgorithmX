// API Client for Banker's Algorithm Calculator
import axios from 'axios';

// API service base URL (if needed for future extensions)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Use demo token for development/testing
    config.headers.Authorization = `Bearer demo-token`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for future API extensions

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await apiClient.post('/api/auth/token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  register: async (email: string, username: string, password: string): Promise<User> => {
    const response = await apiClient.post('/api/auth/register', {
      email,
      username,
      password
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};

// External APIs
export const externalAPI = {
  searchWeb: async (query: string, count: number = 10) => {
    const response = await apiClient.get('/api/external/search', {
      params: { query, count }
    });
    return response.data;
  },

  searchNews: async (query: string, count: number = 5) => {
    const response = await apiClient.get('/api/external/search/news', {
      params: { query, count }
    });
    return response.data;
  },

  getCryptoMarket: async () => {
    const response = await apiClient.get('/api/external/crypto/market');
    return response.data;
  },

  getCryptoPrice: async (symbol: string) => {
    const response = await apiClient.get(`/api/external/crypto/price/${symbol}`);
    return response.data;
  },

  getTrendingCrypto: async () => {
    const response = await apiClient.get('/api/external/crypto/trending');
    return response.data;
  },

  getApiHealth: async () => {
    const response = await apiClient.get('/api/external/health');
    return response.data;
  }
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getStatus: async () => {
    const response = await apiClient.get('/api/status');
    return response.data;
  }
};

export default apiClient;