import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Interface untuk response API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

// Interface untuk error response
export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

class ApiService {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Base URL bisa diubah sesuai environment
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor untuk menambahkan token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor untuk handle error dan refresh token
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Coba refresh token jika ada refresh token
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const newToken = await this.refreshToken(refreshToken);
              this.setToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Jika refresh gagal, logout user
            this.removeTokens();
            window.location.href = '/signin';
            return Promise.reject(refreshError);
          }
        }

        // Format error response
        const formattedError: ApiError = {
          success: false,
          message: error.response?.data?.message || 'Terjadi kesalahan',
          statusCode: error.response?.status,
          errors: error.response?.data?.errors,
        };

        return Promise.reject(formattedError);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  public removeTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Refresh token method
  private async refreshToken(refreshToken: string): Promise<string> {
    const response = await this.instance.post('/auth/refresh', { refreshToken });
    return response.data.data.accessToken;
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  // Utility method untuk upload file
  public async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export helper functions
export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  apiService.setToken(accessToken);
  if (refreshToken) {
    apiService.setRefreshToken(refreshToken);
  }
};

export const removeAuthTokens = () => {
  apiService.removeTokens();
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export default apiService;