import React from 'react';
import BaseGenerateModal from '../BaseGenerateModal';

interface GenerateCashAdvanceProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const GenerateCashAdvance: React.FC<GenerateCashAdvanceProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting
}) => {
  return (
    <BaseGenerateModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      submitting={submitting}
      title="Pengajuan Kasbon"
      showWarning={true}
    />
  );
};

export default GenerateCashAdvance;