import apiService, {  setAuthTokens, removeAuthTokens } from '../../../services/api';
import {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from '../types/Index';

class AuthService {
  private readonly basePath = '/auth';

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(`${this.basePath}/login`, data);
    setAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiService.post<ForgotPasswordResponse>(`${this.basePath}/forgot-password`, data);
    return response.data;
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiService.post<ResetPasswordResponse>(`${this.basePath}/reset-password`, data);
    return response.data;
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>(`${this.basePath}/me`);
    return response.data.user;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post(`${this.basePath}/logout`);
    } catch (error) {
      // Tetap hapus token meskipun request gagal
      console.error('Logout error:', error);
    } finally {
      // Hapus tokens dari localStorage
      removeAuthTokens();
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response = await apiService.post<{ accessToken: string }>(`${this.basePath}/refresh`, {
        refreshToken,
      });
      
      // Update access token
      setAuthTokens(response.data.accessToken);
      
      return response.data;
    } catch (error) {
      // Jika refresh gagal, logout user
      removeAuthTokens();
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(`${this.basePath}/verify-email`, {
      token,
    });
    return response.data;
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(`${this.basePath}/resend-verification`, {
      email,
    });
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;