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
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Axios error interceptor:", error);
    }
    
    // Handle network errors (no response)
    if (!error.response) {
      return Promise.reject({
        message: error.message || 'Network error - please check your connection',
        status: 0,
        data: null
      });
    }
    
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
    let errorMessage = error.response?.data?.message || error.response?.statusText || 'An unexpected error occurred';
    
    // Handle FastAPI validation errors (422)
    if (error.response?.status === 422 && error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        // Format validation errors
        errorMessage = detail.map((err: { msg: string; loc: string[] }) => 
          `${err.loc.join('.')}: ${err.msg}`
        ).join(', ');
      }
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;