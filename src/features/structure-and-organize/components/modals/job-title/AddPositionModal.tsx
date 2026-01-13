import ModalAddEdit from "../../../../../components/shared/modal/ModalAddEdit";
import FileInput from "../../../../../components/shared/form/FileInput";
import InputField from "@/components/shared/field/InputField";
import TextAreaField from "@/components/shared/field/TextAreaField";
import { useAddPositionModal } from '../../../hooks/modals/job-title/useAddPositionModal';
import { IconPlus } from "@/icons/components/icons";
import { TrashBinIcon } from "@/icons";

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
    structuralPositions,
    addStructuralRow,
    removeStructuralRow,
    updateStructuralAt,
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
          {/* <InputField
            label="Jabatan Struktural"
            required
            containerClassName="hidden"
          /> */}
          <div className="space-y-3">
            {structuralPositions.map((value, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 md:col-span-11">
                  <InputField
                    id={`structural-${idx}`}
                    required
                    label={idx===0?'Jabatan Struktural':''}
                    placeholder={'Masukan Jabatan Struktural'}
                    value={value}
                    onChange={(e) => updateStructuralAt(idx, e.target.value)}
                  />
                </div>
                <div className="col-span-12 md:col-span-1 flex gap-2 mb-1">
                  {idx === 0 ? (
                    <button
                      type="button"
                      onClick={addStructuralRow}
                      className="ml-0 h-11 w-full rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 md:w-9 md:h-9 md:px-0"
                      aria-label="Tambah jabatan struktural"
                    >
                      <span className="inline-flex items-center justify-center w-full">
                        <IconPlus size={20} />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeStructuralRow(idx)}
                      className="ml-0 h-11 w-full rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-600 md:w-9 md:h-9 md:px-0"
                      aria-label="Hapus baris jabatan struktural"
                    >
                      <span className="inline-flex items-center justify-center w-full">
                        <TrashBinIcon className="h-5 w-5" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
