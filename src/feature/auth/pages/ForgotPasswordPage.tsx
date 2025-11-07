import PageMeta from '../../../components/common/PageMeta';
import AuthLayout from '../../../pages/AuthPages/AuthPageLayout';
import { ForgotPasswordForm } from '../components';
import { useForgotPassword } from '../hooks';

export default function ForgotPasswordPage() {
  const { isLoading, error, successMessage, handleForgotPassword } =
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
        />
      </AuthLayout>
    </>
  );
}