import React from "react";
import { Modal } from "@/components/ui/modal";
import InputField from "@/components/shared/field/InputField";
import { useLoginPayrollModal } from "@/features/payroll/hooks/modals/useLoginPayrollModal";

interface LoginPayrollModalProps {
  onSubmit?: (password: string) => void | Promise<void>;
}

const LoginPayrollModal: React.FC<LoginPayrollModalProps> = ({
  onSubmit,
}) => {
  const { isOpen, closeModal, form, setField, handleSubmit, loading } = useLoginPayrollModal({
    onSubmit,
  });

  return (
    <Modal isOpen={isOpen} onClose={closeModal} showCloseButton={false} className={`${ 'max-w-md'} p-6 zoom-75 dark:text-white `}>
      <div className="w-full max-w-md px-6 py-8 sm:px-8 sm:py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verifikasi <span className="text-blue-600">Keamanan</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Masukkan kata sandi untuk mengakses informasi gaji
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {form.error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{form.error}</p>
            </div>
          )}

          {/* Password Field */}
          <InputField
            type="password"
            id="payroll-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            disabled={loading}
            containerClassName="w-full"
            className="w-full"
            required
          />

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading || !form.password.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginPayrollModal;
