import React from 'react';
import BaseGenerateModal from '../BaseGenerateModal';

interface GenerateResignationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  submitting: boolean;
}

const GenerateResignation: React.FC<GenerateResignationProps> = ({
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
      title="Pengajuan Pengunduran Diri"
      showWarning={false}
      submissionType="Pengunduran Diri"
    />
  );
};

export default GenerateResignation;