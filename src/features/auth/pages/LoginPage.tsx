import PageMeta from '../../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import { LoginForm } from '../components/Index';
import { useLogin } from '../hooks/Index';

export default function LoginPage() {
  const { isLoading, error, handleLogin, formData, showPassword, keepMeLoggedIn, handleInputChange, handleKeepMeLoggedInChange, toggleShowPassword } = useLogin();

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
          formData={formData}
          showPassword={showPassword}
          keepMeLoggedIn={keepMeLoggedIn}
          onInputChange={handleInputChange}
          onKeepMeLoggedInChange={handleKeepMeLoggedInChange}
          onToggleShowPassword={toggleShowPassword}
        />
      </AuthLayout>
    </>
  );
}
