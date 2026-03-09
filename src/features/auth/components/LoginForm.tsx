import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IconEyeOpen, IconEyeClose } from '@/icons/components/icons';
import Checkbox from '../../../components/form/input/Checkbox';
import Button from '../../../components/ui/button/Button';
import InputField from '../../../components/shared/field/InputField';
import Label from '../../../components/form/Label';
import { LoginRequest } from '../types/Index';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  formData: LoginRequest;
  showPassword: boolean;
  keepMeLoggedIn: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeepMeLoggedInChange: (checked: boolean) => void;
  onToggleShowPassword: () => void;
}

export default function LoginForm({ onSubmit, isLoading = false, error = null, formData, showPassword, keepMeLoggedIn, onInputChange, onKeepMeLoggedInChange, onToggleShowPassword }: LoginFormProps) {
  const [adminContact, setAdminContact] = useState('+62 851-4250-5733');

  useEffect(() => {
    const savedContact = localStorage.getItem('adminContact');
    if (savedContact) {
      setAdminContact(savedContact);
    }
  }, []);

  const handleContactClick = () => {
    const formattedNumber = adminContact.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/images/logo-icon.svg" alt="logo" className="w-12 h-12" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Welcome to <span className="text-blue-600">HRIS</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your email and password to sign in!
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={onInputChange}
          required
          disabled={isLoading}
          className="w-full"
        />

        <InputField
          label="Password"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={formData.password}
          onChange={onInputChange}
          required
          disabled={isLoading}
          className="w-full"
          suffix={
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              disabled={isLoading}
            >
              {showPassword ? <IconEyeClose /> : <IconEyeOpen />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="keep-me-logged-in"
              checked={keepMeLoggedIn}
              onChange={onKeepMeLoggedInChange}
              disabled={isLoading}
            />
            <Label htmlFor="keep-me-logged-in" className="text-sm font-normal text-gray-700 dark:text-gray-300">
              Keep me logged in
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          size="md"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <span 
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={handleContactClick}
        >
          Contact admin
        </span>
      </div>
    </div>
  );
}
