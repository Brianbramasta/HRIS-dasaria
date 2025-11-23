import React from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import Button from '@/components/ui/button/Button';



interface ModalAddEditProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  handleSubmit?: () => void;
  submitting: boolean;
  maxWidth?: string;
  confirmTitleButton?: string;
  closeTitleButton?: string;
}

const ModalAddEdit: React.FC<ModalAddEditProps> = ({ title, content, isOpen, onClose,  handleSubmit, submitting, maxWidth, confirmTitleButton = 'Simpan', closeTitleButton = 'Tutup' }) => {
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`${maxWidth || 'max-w-xl'} p-6 zoom-75 dark:text-white `} showCloseButton>
      <div className="space-y-6 ">
        <form className='' onSubmit={(e) => {e.preventDefault(); handleSubmit?.()}}>
        <h2 className="text-3xl font-bold text-center">{title}</h2>
        <div className='max-h-[100vh] overflow-y-auto mb-4'>
          {content}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant={'outline'} onClick={onClose} className="rounded-xl border px-5 py-2">{closeTitleButton}</Button>
          <Button
            
            // onClick={handleSubmit}
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            {confirmTitleButton}
          </Button>
        </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddEdit;