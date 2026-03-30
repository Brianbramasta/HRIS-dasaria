import React from 'react';
import BaseGenerateModal from '../BaseGenerateModal';

interface GenerateCashAdvanceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  submitting: boolean;
}

const GenerateCashAdvance: React.FC<GenerateCashAdvanceProps> = ({
  isOpen,
  onClose,
  onSuccess,
  submitting
}) => {
  return (
    <BaseGenerateModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      submitting={submitting}
      title="Pengajuan Kasbon"
      showWarning={true}
      submissionType="Kasbon"
    />
  );
};

export default GenerateCashAdvance;