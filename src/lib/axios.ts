import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Try to get token from NextAuth session first
    if (typeof window !== 'undefined') {
      try {
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          return config;
        }
      } catch (error) {
        // If session fetch fails, continue to fallback
        console.error('Failed to get session:', error);
      }
    }
    
    // Fallback to localStorage for backward compatibility
    const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - sign out using NextAuth
      if (typeof window !== 'undefined') {
        try {
          const { signOut } = await import('next-auth/react');
          await signOut({ redirect: true, callbackUrl: '/signin' });
        } catch (signOutError) {
          // Fallback: clear local storage and redirect
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/signin';
        }
      }
    }
    
    // Return the error with a consistent format
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;