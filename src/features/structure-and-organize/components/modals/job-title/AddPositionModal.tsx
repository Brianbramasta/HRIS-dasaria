import ModalAddEdit from "../../../../../components/shared/modal/ModalAddEdit";
import FileInput from "../../../../../components/shared/form/FileInput";
import InputField from "@/components/shared/field/InputField";
import TextAreaField from "@/components/shared/field/TextAreaField";
import { useAddPositionModal } from '../../../hooks/modals/job-title/useAddPositionModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddPositionModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const {
    name,
    setName,
    grade,
    setGrade,
    directSubordinates,
    setDirectSubordinates,
    memoNumber,
    setMemoNumber,
    jobDescription,
    setJobDescription,
    skFile,
    submitting,
    handleFileChange,
    handleSubmit,
  } = useAddPositionModal({ isOpen, onClose, onSuccess });

  return (
    <ModalAddEdit
      title="Tambah Jabatan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-2xl"
      confirmTitleButton="Save"
      closeTitleButton="Close"
      content={(
        <div className="space-y-6">
          <InputField
            required
            label="Nama Jabatan"
            id="name"
            placeholder="Nama Jabatan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            required
            label="Golongan"
            id="grade"
            placeholder="Masukkan golongan (mis. D0)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <InputField
            label="Bawahan Langsung"
            id="directSubordinates"
            placeholder="Manager, dll"
            value={directSubordinates}
            onChange={(e) => setDirectSubordinates(e.target.value)}
          />
          <InputField
            required
            label="No. Surat Keputusan / Memo Internal"
            id="memoNumber"
            placeholder="SK-Dasaria/09/2025"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
          />
          <TextAreaField
            required
            label="Deskripsi Tugas"
            // id="jobDescription"
            rows={4}
            placeholder="Enter as description ..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e)}
          />
          <FileInput 
            onChange={handleFileChange}
            skFileName={skFile?.name || ''}
            required
          />
        </div>
      )}
    />
  );
};
