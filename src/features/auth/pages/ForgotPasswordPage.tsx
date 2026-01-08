import PageMeta from '../../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import { ForgotPasswordForm } from '../components/Index';
import { useForgotPassword } from '../hooks/Index';

export default function ForgotPasswordPage() {
  const { isLoading, error, successMessage, handleForgotPassword, formData, handleInputChange } =
    useForgotPassword();

  return (
    <>
      <PageMeta
        title="Forgot Password - HRIS Dashboard"
        description="Reset your HRIS dashboard account password"
      />
      <AuthLayout>
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
          formData={formData}
          onInputChange={handleInputChange}
        />
      </AuthLayout>
    </>
  );
}
