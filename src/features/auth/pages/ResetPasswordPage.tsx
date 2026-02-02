import PageMeta from '../../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import { ResetPasswordForm } from '../components/Index';
import { useResetPassword } from '../hooks/Index';

export default function ResetPasswordPage() {
    const {
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
    } = useResetPassword();

    return (
        <>
            <PageMeta
                title="Reset Password - HRIS Dashboard"
                description="Create a new password for your HRIS dashboard account"
            />
            <AuthLayout>
                <ResetPasswordForm
                    onSubmit={handleResetPassword}
                    isLoading={isLoading}
                    error={error}
                    successMessage={successMessage}
                    formData={formData}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    onInputChange={handleInputChange}
                    onToggleShowPassword={toggleShowPassword}
                    onToggleShowConfirmPassword={toggleShowConfirmPassword}
                />
            </AuthLayout>
        </>
    );
}
