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
  formData: ForgotPasswordRequest;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  error = null,
  successMessage = null,
  formData,
  onInputChange
}: ForgotPasswordFormProps) {


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
            onChange={onInputChange}
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
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.96194 4.30392L2.71919 8.54667C2.57858 8.68731 2.4996 8.87804 2.4996 9.07692C2.4996 9.27579 2.57858 9.46652 2.71919 9.60717L6.96194 13.8499C7.10339 13.9865 7.29284 14.0621 7.48949 14.0604C7.68614 14.0587 7.87425 13.9798 8.0133 13.8408C8.15236 13.7017 8.23123 13.5136 8.23294 13.317C8.23465 13.1203 8.15906 12.9309 8.02244 12.7894L5.05994 9.82692H14.9922C15.1911 9.82692 15.3819 9.7479 15.5225 9.60725C15.6632 9.4666 15.7422 9.27583 15.7422 9.07692C15.7422 8.87801 15.6632 8.68724 15.5225 8.54659C15.3819 8.40594 15.1911 8.32692 14.9922 8.32692H5.05994L8.02244 5.36442C8.09407 5.29523 8.15121 5.21247 8.19051 5.12097C8.22982 5.02947 8.25051 4.93105 8.25138 4.83147C8.25224 4.73188 8.23326 4.63312 8.19555 4.54095C8.15784 4.44878 8.10215 4.36504 8.03173 4.29462C7.96131 4.2242 7.87758 4.16851 7.7854 4.1308C7.69323 4.09309 7.59447 4.07411 7.49489 4.07498C7.3953 4.07584 7.29689 4.09653 7.20538 4.13584C7.11388 4.17515 7.03112 4.23228 6.96194 4.30392Z" fill="#242425" />
          </svg>
          Back To Login
        </Link>
      </div>
    </div>
  );
}
