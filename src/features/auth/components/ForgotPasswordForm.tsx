import { useState } from 'react';
import { Link } from 'react-router-dom';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Button from '../../../components/ui/button/Button';
import { ForgotPasswordRequest } from '../types/Index';
// import Logo from '../../../components/common/Logo';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}

export default function ForgotPasswordForm({ 
  onSubmit, 
  isLoading = false, 
  error = null,
  successMessage = null 
}: ForgotPasswordFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="w-full max-w-sm mx-auto ">
      <div className="mb-8 text-center">
        {/* <div className="flex justify-center mb-4">
          <Logo />
        </div> */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Forgot Your Password?
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter the email address linked to your account, and we’ll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading || !!successMessage}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !!successMessage}
          size="md"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-gray-600 hover:underline dark:text-gray-400"
        >
          ← Back To Login
        </Link>
      </div>
    </div>
  );
}