import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/modal';
import { useModal } from '../../../../hooks/useModal';
import Button from '@/components/ui/button/Button';
import { addNotification } from '@/stores/notificationStore';
import { IconShare } from '@/icons/components/icons';

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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/data-karyawan/form`;
    const title = 'Pendaftaran Karyawan Baru';
    const text = 'Silakan isi form pendaftaran karyawan baru.';
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        addNotification({
          variant: 'success',
          title: 'Link pendaftaran disalin',
          description: shareUrl,
          hideDuration: 3000,
        });
      }
    } catch (err) {
      console.log(err)
      addNotification({
        variant: 'error',
        title: 'Gagal membagikan tautan',
        hideDuration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg" showCloseButton>
        <button
          type="button"
          onClick={handleShare}
          className="absolute right-14 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-20 sm:top-6 sm:h-11 sm:w-11"
          aria-label="Bagikan"
        >
         <IconShare />
          
        </button>
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
            className="font-semibold"
          >
            Mulai Pendaftaran
          </Button>
        </div>
      </Modal>
    </div>
  );
}
