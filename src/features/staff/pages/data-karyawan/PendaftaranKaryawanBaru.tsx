import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/modal';
import { useModal } from '../../../../hooks/useModal';

export default function PendaftaranKaryawanBaru() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal(false);

  useEffect(() => {
    openModal();
  }, [openModal]);

  const handleMulai = () => {
    closeModal();
    navigate('/data-karyawan/form');
  };

  const handleClose = () => {
    closeModal();
    navigate('/data-karyawan');
  };

  return (
    <div className="min-h-screen">
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md" showCloseButton>
        <div className="p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Datang di Pendaftaran Karyawan Baru
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Isi form berikut untuk melengkapi proses pendaftaran. Kami membutuhkan beberapa informasi dasar untuk memulai.
          </p>
          <button
            onClick={handleMulai}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none"
          >
            Mulai Pendaftaran
          </button>
        </div>
      </Modal>
    </div>
  );
}