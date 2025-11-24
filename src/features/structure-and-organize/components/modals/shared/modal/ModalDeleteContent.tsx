import React from 'react';
import Input from '@/components/form/input/InputField';
import FileInput from '../field/FileInput';

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
      <div className="space-y-2">
        <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
        <Input
          required
          type="text"
          value={memoNumber}
          onChange={onMemoNumberChange}
          className={inputClass}
        />
      </div>
      <FileInput skFileName={skFileName} onChange={onFileChange} />
      {note ? <p className="text-xs text-gray-500">{note}</p> : null}
    </>
  );
};

export default ModalDeleteContent;
