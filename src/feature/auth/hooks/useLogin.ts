import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { LoginRequest } from '../types';
import { ApiError } from '../../../services/api';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(data);

      const intendedUrl = localStorage.getItem('intended_url') || '/';
      localStorage.removeItem('intended_url');

      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('Login successful:', response);

      navigate(intendedUrl);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Login error:', apiError);

      if (apiError.statusCode === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (apiError.statusCode === 403) {
        setError('Your account is not verified. Please check your email.');
      } else if (apiError.statusCode === 404) {
        setError('User not found. Please check your email.');
      } else if (apiError.message) {
        setError(apiError.message);
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
    handleLogin,
  };
};