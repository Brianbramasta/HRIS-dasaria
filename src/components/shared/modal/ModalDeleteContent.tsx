import React from 'react';
import InputField from '@/components/shared/field/InputField';
import FileInput from '../form/FileInput';

type Props = {
  memoNumber: string;
  onMemoNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  memoNumberReadOnly?: boolean;
  skFileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  note?: string;
};

const ModalDeleteContent: React.FC<Props> = ({
  memoNumber,
  onMemoNumberChange,
  memoNumberReadOnly = false,
  skFileName,
  onFileChange,
  note,
}) => {
  const inputClass = `w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary${memoNumberReadOnly ? ' bg-gray-100' : ''}`;
  return (
    <>
      <InputField
        required
        label="No. Surat Keputusan / Memo Internal"
        type="text"
        value={memoNumber}
        onChange={onMemoNumberChange}
        className={inputClass}
        readonly={memoNumberReadOnly}
        containerClassName="mb-2"
      />
      <FileInput skFileName={skFileName} onChange={onFileChange} required />
      {note ? <p className="text-xs text-gray-500">{note}</p> : null}
    </>
  );
};

export default ModalDeleteContent;
