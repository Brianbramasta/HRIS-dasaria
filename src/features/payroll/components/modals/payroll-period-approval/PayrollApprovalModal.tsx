import React from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import Button from '@/components/ui/button/Button';

interface PayrollApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
  statusPersetujuan?: string;
  periodDate?: string;
  approvalType?: string; // Tambah approval type
  isDistributionPage?: boolean; // Tambah prop untuk distribusi page
}

const PayrollApprovalModal: React.FC<PayrollApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  submitting = false,
  statusPersetujuan = '',
  periodDate = '',
  approvalType = '',
  isDistributionPage = false,
}) => {
  const getModalContent = () => {
    // Jika ini adalah halaman distribusi, tampilkan konten distribusi
    if (isDistributionPage) {
      return {
        label: "Distribusikan Slip Gaji?",
        description: "Sistem akan segera mengirimkan slip gaji ke email masing-masing karyawan yang terdaftar. Proses distribusi ini tidak dapat dibatalkan."
      };
    }
    
    // Gunakan approvalType untuk menentukan konten modal
    const cleanApprovalType = approvalType.trim();
    
    if (cleanApprovalType === 'Persetujuan oleh Direktur HRGA') {
      return {
        label: "Setujui & Teruskan ke FAT",
        description: "Anda akan menyetujui data penggajian ini. Data selanjutnya akan diteruskan ke tim FAT untuk proses verifikasi keuangan dan anggaran."
      };
    }
    
    if (cleanApprovalType === 'Persetujuan oleh FAT') {
      return {
        label: "Verifikasi Keuangan Selesai?",
        description: "Data telah diverifikasi oleh FAT. Apakah Anda yakin ingin meneruskan data ini ke BOD untuk mendapatkan pengesahan/persetujuan akhir?"
      };
    }
    
    if (cleanApprovalType === 'Persetujuan oleh BOD') {
      return {
        label: "Persetujuan Final",
        description: "Dengan menyetujui, data ini dinyatakan sah dan siap untuk didistribusikan. Lanjutkan ke tahap Distribusi Gaji & Slip Gaji?"
      };
    }
    
    // Fallback ke status persetujuan jika approvalType tidak ada
    const normalizedStatus = statusPersetujuan.trim().toLowerCase();
    
    if (normalizedStatus === 'menunggu diproses direktur hrga') {
      return {
        label: "Setujui & Teruskan ke FAT",
        description: "Anda akan menyetujui data penggajian ini. Data selanjutnya akan diteruskan ke tim FAT untuk proses verifikasi keuangan dan anggaran."
      };
    }
    
    if (normalizedStatus === 'menunggu diproses fat') {
      return {
        label: "Verifikasi Keuangan Selesai?",
        description: "Data telah diverifikasi oleh FAT. Apakah Anda yakin ingin meneruskan data ini ke BOD untuk mendapatkan pengesahan/persetujuan akhir?"
      };
    }
    
    if (normalizedStatus === 'menunggu diproses bod') {
      return {
        label: "Persetujuan Final",
        description: "Dengan menyetujui, data ini dinyatakan sah dan siap untuk didistribusikan. Lanjutkan ke tahap Distribusi Gaji & Slip Gaji?"
      };
    }
    
    // Default fallback
    return {
      label: "Apakah anda yakin melanjutkan ke tahap approval ?",
      description: "Periode gaji yang disahkan akan dikunci dan tidak dapat diubah. Pastikan semua data telah sesuai sebelum melanjutkan proses approval."
    };
  };

  const { label, description } = getModalContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 zoom-75 dark:text-white" showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">
            <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M71.5 39C71.5 56.9497 56.9497 71.5 39 71.5C21.0503 71.5 6.5 56.9497 6.5 39C6.5 21.0503 21.0503 6.5 39 6.5C56.9497 6.5 71.5 21.0503 71.5 39ZM39 65C45.8956 65 52.5088 62.2607 57.3848 57.3848C62.2607 52.5088 65 45.8956 65 39C65 32.1044 62.2607 25.4912 57.3848 20.6152C52.5088 15.7393 45.8956 13 39 13C32.1044 13 25.4912 15.7393 20.6152 20.6152C15.7393 25.4912 13 32.1044 13 39C13 45.8956 15.7393 52.5088 20.6152 57.3848C25.4912 62.2607 32.1044 65 39 65Z" fill="#FD7E14" />
              <path fillRule="evenodd" clipRule="evenodd" d="M39 45.5C38.138 45.5 37.3114 45.1576 36.7019 44.5481C36.0924 43.9386 35.75 43.112 35.75 42.25V26C35.75 25.138 36.0924 24.3114 36.7019 23.7019C37.3114 23.0924 38.138 22.75 39 22.75C39.862 22.75 40.6886 23.0924 41.2981 23.7019C41.9076 24.3114 42.25 25.138 42.25 26V42.25C42.25 43.112 41.9076 43.9386 41.2981 44.5481C40.6886 45.1576 39.862 45.5 39 45.5Z" fill="#FD7E14" />
              <path d="M35.75 52C35.75 51.138 36.0924 50.3114 36.7019 49.7019C37.3114 49.0924 38.138 48.75 39 48.75C39.862 48.75 40.6886 49.0924 41.2981 49.7019C41.9076 50.3114 42.25 51.138 42.25 52C42.25 52.862 41.9076 53.6886 41.2981 54.2981C40.6886 54.9076 39.862 55.25 39 55.25C38.138 55.25 37.3114 54.9076 36.7019 54.2981C36.0924 53.6886 35.75 52.862 35.75 52Z" fill="#FD7E14" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center">
            {label}
          </h2>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {periodDate && (
              <>
                {/* <span>Data yang disahkan pada {periodDate}</span>
                <br />
                <br /> */}
              </>
            )}
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl border px-5 py-2">
            Kembali
          </Button>
          <Button
            onClick={onConfirm}
            disabled={submitting}
            className="rounded-xl bg-green-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Ya, Lanjutkan
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PayrollApprovalModal;
