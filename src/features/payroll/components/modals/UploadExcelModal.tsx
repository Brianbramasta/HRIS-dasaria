import React from 'react';
import { Modal } from '@/components/ui/modal/index';
import { useUploadExcelModal } from '@/features/payroll/hooks/modals/useUploadExcelModal';

// Dokumentasi: Modal upload CSV untuk impor data penggajian, memakai Modal UI & react-dropzone
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (file: File) => Promise<void> | void;
  submitting?: boolean;
};

const UploadExcelModal: React.FC<Props> = ({ isOpen, onClose, onImport, submitting = false }) => {
  const { file, setFile, error, getRootProps, getInputProps, isDragActive, handleSubmit } = useUploadExcelModal({
    onImport,
    submitting,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6 zoom-90 dark:text-white" showCloseButton>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Import Data Penggajian</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Upload file CSV untuk mengimpor data penggajian ke sistem</p>
        </div>

        <div
          {...getRootProps({
            className:
              'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ' +
              (isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'),
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-gray-100 p-3 text-gray-600 dark:bg-gray-800">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V8M12 8l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 16v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-lg font-semibold">Drag CSV di sini</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Atau klik untuk memilih (10MB maks)</p>
            {file && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                <span className="font-medium">{file.name}</span>
                <button type="button" className="text-red-600" onClick={() => setFile(null)}>Hapus</button>
              </div>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300">* Harap file menyesuaikan dengan <a className="text-blue-600 underline" href="#" onClick={(e) => e.preventDefault()}>Template</a> yang ada</p>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border px-5 py-2">Tutup</button>
          <button type="submit" disabled={!file || submitting} className="rounded-xl bg-green-600 px-5 py-2 text-white disabled:opacity-60">
            Import
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadExcelModal;

