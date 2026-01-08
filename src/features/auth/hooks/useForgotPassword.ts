import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/Index';
import { ForgotPasswordRequest } from '../types/Index';
import { ApiError } from '../../../services/api';

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await authService.forgotPassword(data);

      setSuccessMessage(response.message || 'Password reset instructions have been sent to your email address.');

      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Forgot password error:', apiError);

      if (apiError.statusCode === 404) {
        setError('Email address not found. Please check your email and try again.');
      } else if (apiError.message) {
        setError(apiError.message);
      } else {
        setError('An error occurred while sending reset instructions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    successMessage,
    formData,
    handleInputChange,
    handleForgotPassword,
  };
};
