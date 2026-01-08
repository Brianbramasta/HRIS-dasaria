import ModalAddEdit from "../../../../../components/shared/modal/ModalAddEdit";
import FileInput from "../../../../../components/shared/form/FileInput";
import Input from "@/components/form/input/InputField";
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
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Jabatan
            </label>
            <Input
              required
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Nama Jabatan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="grade"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Golongan
            </label>
            <Input
              required
              type="text"
              id="grade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Masukkan golongan (mis. D0)"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="directSubordinates"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Bawahan Langsung
            </label>
            <Input
              required
              type="text"
              id="directSubordinates"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Manager, dll"
              value={directSubordinates}
              onChange={(e) => setDirectSubordinates(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="memoNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              No. Surat Keputusan / Memo Internal
            </label>
            <Input
              required
              type="text"
              id="memoNumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="SK-Dasaria/09/2025"
              value={memoNumber}
              onChange={(e) => setMemoNumber(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="jobDescription"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Deskripsi Tugas
            </label>
            <textarea
              required
              id="jobDescription"
              rows={4}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter as description ..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
          <FileInput 
            onChange={handleFileChange}
            skFileName={skFile?.name || ''}
          />
        </div>
      )}
    />
  );
};
