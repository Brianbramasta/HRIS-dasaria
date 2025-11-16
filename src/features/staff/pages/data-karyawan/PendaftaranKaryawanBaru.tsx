import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/modal';
import { useModal } from '../../../../hooks/useModal';
import Button from '@/components/ui/button/Button';

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
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg" showCloseButton>
        <div className="py-6 sm:px-12 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full  text-brand-600">
              <img src="/images/logo/logo-icon.svg" alt="logo" className="h-16 w-16 rounded-full" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Datang di Pendaftaran Karyawan Baru
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Isi form berikut untuk melengkapi proses pendaftaran. Kami membutuhkan beberapa informasi dasar untuk memulai.
          </p>
          <Button
          variant='outline'
            onClick={handleMulai}
            className=""
          >
            Mulai Pendaftaran
          </Button>
        </div>
      </Modal>
    </div>
  );
}