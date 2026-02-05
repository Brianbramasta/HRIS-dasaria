import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/Index';
import { ApiError } from '../../../services/api';

export const useResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            // We use the token from URL if available, otherwise we might need to handle it differently
            // The design shows an email field, so we'll include it if the API supports it.
            // For now, following the existing ResetPasswordRequest structure + email
            await authService.resetPassword({
                token: token,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                // email: formData.email, // If API supports it
            } as any);

            setSuccessMessage('Password has been reset successfully. Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.meta?.message || 'An error occurred while resetting your password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        successMessage,
        formData,
        showPassword,
        showConfirmPassword,
        handleInputChange,
        handleResetPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,
    };
};
