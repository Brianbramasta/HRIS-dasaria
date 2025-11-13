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
}

const ModalAddEdit: React.FC<ModalAddEditProps> = ({ title, content, isOpen, onClose,  handleSubmit, submitting, maxWidth }) => {
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`${maxWidth || 'max-w-3xl'} p-6 zoom-50 dark:text-white`} showCloseButton>
      <div className="space-y-6">
        <form onSubmit={(e) => {e.preventDefault(); handleSubmit?.()}}>
        <h2 className="text-3xl font-bold text-center">{title}</h2>
        
        {content}
        
        <div className="flex justify-end gap-3">
          <Button variant={'outline'} onClick={onClose} className="rounded-xl border px-5 py-2">Close</Button>
          <Button
            
            // onClick={handleSubmit}
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Save
          </Button>
        </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddEdit;