import ModalAddEdit from "../../../../../components/shared/modal/ModalAddEdit";
import type { PositionListItem } from "../../../types/OrganizationApiTypes";
import FileInput from "../../../../../components/shared/form/FileInput";
import InputField from "@/components/shared/field/InputField";
import TextAreaField from "@/components/shared/field/TextAreaField";
import { useEditPositionModal } from "../../../hooks/modals/job-title/useEditPositionModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  position?: PositionListItem | null;
};

export const EditPositionModal = ({ isOpen, onClose, onSuccess, position }: Props) => {
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
  } = useEditPositionModal({ isOpen, onClose, onSuccess, position: position ?? null });

  const content = (
    <div className="space-y-6">
      <InputField
        required
        label="Nama Jabatan"
        id="name"
        placeholder="Direktur"
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
        required
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
        placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
        value={jobDescription}
        onChange={(e) => setJobDescription(e)}
      />
      <FileInput
        onChange={handleFileChange}
        skFileName={skFile?.name || position?.skFile?.fileName || ''}
        required
      />
    </div>
  );

  return (
    <ModalAddEdit
      title="Update Jabatan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-2xl"
      confirmTitleButton="Save Changes"
      closeTitleButton="Close"
      content={content}
    />
  );
};
