import React from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import type { Office } from '../../../../types/organization.types';

interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: Office | null;
  handleDelete?: () => Promise<void>;
  submitting?: boolean;
  content?: React.ReactNode;
  confirmTitleButton?: string;
  closeTitleButton?: string;
  isAlert?: boolean;
  title?: string;
  maxWidth?: string;
}

const DeleteOfficeModal: React.FC<DeleteOfficeModalProps> = ({ content, isOpen, onClose, handleDelete, submitting=false, confirmTitleButton = 'Hapus', closeTitleButton = 'Tutup', title = 'Hapus Data', isAlert = true, maxWidth = 'max-w-md' }) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={` p-6 zoom-75 dark:text-white ${maxWidth}`} showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">
            <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.8561 68.25C8.26027 68.25 7.7186 68.1016 7.2311 67.8048C6.7436 67.5079 6.36444 67.1147 6.0936 66.625C5.82277 66.1353 5.67435 65.6067 5.64835 65.039C5.62235 64.4713 5.77077 63.9167 6.0936 63.375L36.1561 11.375C36.4811 10.8333 36.9014 10.4271 37.4171 10.1562C37.9328 9.88542 38.4604 9.75 38.9999 9.75C39.5394 9.75 40.068 9.88542 40.5859 10.1562C41.1037 10.4271 41.5229 10.8333 41.8436 11.375L71.9061 63.375C72.2311 63.9167 72.3806 64.4724 72.3546 65.0423C72.3286 65.6121 72.1791 66.1397 71.9061 66.625C71.6331 67.1103 71.2539 67.5036 70.7686 67.8048C70.2833 68.1059 69.7416 68.2543 69.1436 68.25H8.8561ZM38.9999 58.5C39.9207 58.5 40.6931 58.188 41.3171 57.564C41.9411 56.94 42.252 56.1687 42.2499 55.25C42.2477 54.3313 41.9357 53.56 41.3139 52.936C40.692 52.312 39.9207 52 38.9999 52C38.079 52 37.3077 52.312 36.6859 52.936C36.064 53.56 35.752 54.3313 35.7499 55.25C35.7477 56.1687 36.0597 56.9411 36.6859 57.5672C37.312 58.1934 38.0834 58.5043 38.9999 58.5ZM38.9999 48.75C39.9207 48.75 40.6931 48.438 41.3171 47.814C41.9411 47.19 42.252 46.4187 42.2499 45.5V35.75C42.2499 34.8292 41.9379 34.0578 41.3139 33.436C40.6899 32.8142 39.9185 32.5022 38.9999 32.5C38.0812 32.4978 37.3099 32.8098 36.6859 33.436C36.0619 34.0622 35.7499 34.8335 35.7499 35.75V45.5C35.7499 46.4208 36.0619 47.1933 36.6859 47.8172C37.3099 48.4412 38.0812 48.7522 38.9999 48.75Z" fill="#DC3545"/>
            </svg>

          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <form onSubmit={(e) => {e.preventDefault(); handleDelete?.()}}>
        <div className='max-h-[60vh] overflow-y-auto pb-4'>
          {content}
          {isAlert && (<p className='pt-2 text-start'>*Data tidak benar-benar dihapus akan tetapi diarsipkan</p>)}
        </div>
        

        <div className="flex justify-end gap-3 ">
          <button type='submit' className="rounded-xl border px-5 py-2">{closeTitleButton}</button>
          <button
          type='submit'
            disabled={submitting}
            className="rounded-xl bg-red-600 px-5 py-2 text-white disabled:opacity-60"
          >
            {confirmTitleButton}
          </button>
        </div>
        </form>
      </div>
    </Modal>
  );
};

export default DeleteOfficeModal;
