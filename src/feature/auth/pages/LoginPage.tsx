import PageMeta from '../../../components/common/PageMeta';
import AuthLayout from '../../../pages/AuthPages/AuthPageLayout';
import { LoginForm } from '../components';
import { useLogin } from '../hooks';

export default function LoginPage() {
  const { isLoading, error, handleLogin } = useLogin();

  return (
    <>
      <PageMeta
        title="Login - HRIS Dashboard"
        description="Login to your HRIS dashboard account"
      />
      <AuthLayout>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </AuthLayout>
    </>
  );
}