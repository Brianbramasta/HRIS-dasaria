import React from 'react';
import BaseGenerateModal from '../BaseGenerateModal';

interface GenerateResignationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const GenerateResignation: React.FC<GenerateResignationProps> = ({
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
      title="Pengajuan Pengunduran Diri"
      showWarning={false}
    />
  );
};

export default GenerateResignation;