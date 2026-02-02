import { Link } from 'react-router-dom';
import { IconEyeOpen, IconEyeClose, IconArrowLeft } from '@/icons/components/icons';
import Button from '../../../components/ui/button/Button';
import InputField from '../../../components/shared/field/InputField';

interface ResetPasswordFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
    successMessage?: string | null;
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
    };
    showPassword: boolean;
    showConfirmPassword: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleShowPassword: () => void;
    onToggleShowConfirmPassword: () => void;
}

export default function ResetPasswordForm({
    onSubmit,
    isLoading = false,
    error = null,
    successMessage = null,
    formData,
    showPassword,
    showConfirmPassword,
    onInputChange,
    onToggleShowPassword,
    onToggleShowConfirmPassword,
}: ResetPasswordFormProps) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="mb-8 ">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    Buat Kata Sandi Baru
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Masukkan alamat email yang terhubung dengan akun Anda dan Masukkan kata sandi baru Anda di bawah ini untuk memperbarui keamanan akun Anda.
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

            <form onSubmit={onSubmit} className="space-y-4">
                <InputField
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Info@gmail.com"
                    value={formData.email}
                    onChange={onInputChange}
                    required
                    disabled={isLoading || !!successMessage}
                    className="w-full"
                />

                <InputField
                    label="Kata Sandi"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onInputChange}
                    required
                    disabled={isLoading || !!successMessage}
                    className="w-full"
                    suffix={
                        <button
                            type="button"
                            onClick={onToggleShowPassword}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            disabled={isLoading || !!successMessage}
                        >
                            {showPassword ? <IconEyeClose /> : <IconEyeOpen />}
                        </button>
                    }
                />

                <InputField
                    label="Konfirmasi Kata Sandi"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Masukkan ulang kata sandi"
                    value={formData.confirmPassword}
                    onChange={onInputChange}
                    required
                    disabled={isLoading || !!successMessage}
                    className="w-full"
                    suffix={
                        <button
                            type="button"
                            onClick={onToggleShowConfirmPassword}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            disabled={isLoading || !!successMessage}
                        >
                            {showConfirmPassword ? <IconEyeClose /> : <IconEyeOpen />}
                        </button>
                    }
                />


                <Button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !!successMessage}
                    size="md"
                >
                    {isLoading ? 'Resetting...' : 'Atur Ulang Kata Sandi'}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:underline dark:text-gray-400"
                >
                    <IconArrowLeft />

                    Kembali ke halaman Login
                </Link>
            </div>
        </div >
    );
}
