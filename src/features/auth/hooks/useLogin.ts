import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/Index';
import { LoginRequest } from '../types/Index';
import { ApiError } from '../../../services/api';
import { useAuthStore } from '../stores/AuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeepMeLoggedInChange = (checked: boolean) => {
    setKeepMeLoggedIn(checked);
    setFormData(prev => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(data);

      const intendedUrl = localStorage.getItem('intended_url') || '/';
      localStorage.removeItem('intended_url');

      setAuth({ user: response.user, accessToken: response.accessToken, refreshToken: response.refreshToken });

      console.log('Login successful:', response);

      navigate(intendedUrl);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Login error:', apiError);

      if (apiError.meta?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (apiError.meta?.status === 403) {
        setError('Your account is not verified. Please check your email.');
      } else if (apiError.meta?.status === 404) {
        setError('User not found. Please check your email.');
      } else if (apiError.meta?.message) {
        setError(apiError.meta.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    formData,
    showPassword,
    keepMeLoggedIn,
    handleInputChange,
    handleKeepMeLoggedInChange,
    toggleShowPassword,
    handleLogin,
  };
};
