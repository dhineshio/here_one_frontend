import api from './axios';

// Types for API responses
export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
}

export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface VerifyPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
}

// Authentication service
export class AuthService {
  // Register user
  static async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    user_type: 'freelancer' | 'startup';
    team_members_count?: number;
  }): Promise<RegisterResponse> {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Sign in user
  static async signIn(data: {
    email: string;
    password: string;
  }): Promise<SignInResponse> {
    try {
      const response = await api.post('/api/auth/signin', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Verify OTP for registration
  static async verifyRegistrationOTP(data: {
    email: string;
    otp_code: string;
  }): Promise<OTPVerificationResponse> {
    try {
      const response = await api.post('/api/auth/verify-registration', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Verify OTP for sign-in
  static async verifySignInOTP(data: {
    email: string;
    otp_code: string;
  }): Promise<OTPVerificationResponse> {
    try {
      const response = await api.post('/api/auth/verify-signin', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Request OTP resend
  static async requestOTP(data: {
    email: string;
    otp_type: 'registration' | 'signin';
  }): Promise<RequestOTPResponse> {
    try {
      const response = await api.post('/api/auth/request-otp', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Request password reset
  static async requestPasswordReset(data: {
    email: string;
  }): Promise<RequestPasswordResetResponse> {
    try {
      const response = await api.post('/api/auth/request-password-reset', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Verify password reset with new password
  static async verifyPasswordReset(data: {
    email: string;
    otp_code: string;
    new_password: string;
  }): Promise<VerifyPasswordResetResponse> {
    try {
      const response = await api.post('/api/auth/verify-password-reset', data);
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }

  // Store authentication tokens
  static storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('auth_token', accessToken); // Keep for backward compatibility
  }

  // Clear authentication tokens
  static clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token');
  }

  // Get access token
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return false;
    }
    return !!this.getAccessToken();
  }

  // Logout user
  static logout(): void {
    this.clearTokens();
  }

}

export default AuthService;