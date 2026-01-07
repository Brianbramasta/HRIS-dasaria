import React from 'react';
import { Modal } from '../../../../../components/ui/modal';
import Button from '../../../../../components/ui/button/Button';
import { Copy, Mail, MessageSquare, Send } from 'react-feather';
import { useShareLinkModal } from '../../../hooks/modals/sharelink/useShareLinkModal';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  message?: string;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  link,
  message,
}) => {
  const { copyLink, openWhatsApp, openEmail, openTelegram } = useShareLinkModal(link, message);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="space-y-6 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bagikan</h2>
        </div>

        <div className="space-y-3">
          <Button onClick={copyLink} variant="outline" className="w-full flex items-center gap-3 py-3">
            <Copy size={18} />
            <span>Salin Tautan</span>
          </Button>
          <Button onClick={openWhatsApp} variant="outline" className="w-full flex items-center gap-3 py-3">
            <MessageSquare size={18} />
            <span>WhatsApp</span>
          </Button>
          <Button onClick={openEmail} variant="outline" className="w-full flex items-center gap-3 py-3">
            <Mail size={18} />
            <span>Email</span>
          </Button>
          <Button onClick={openTelegram} variant="outline" className="w-full flex items-center gap-3 py-3">
            <Send size={18} />
            <span>Telegram</span>
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;
