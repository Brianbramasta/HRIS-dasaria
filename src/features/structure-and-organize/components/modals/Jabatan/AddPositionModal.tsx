import { useState } from "react";
import ModalAddEdit from "../shared/modal/modalAddEdit";
import { positionsService } from "../../../services/request/positions.service";
import { useFileStore } from '@/stores/fileStore';
import FileInput from "../shared/field/FileInput";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { addNotification } from "@/stores/notificationStore";



type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddPositionModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    directSubordinates: "",
    memoNumber: "",
    jobDescription: "",
    skFile: null as File | null ,
  });
  const [isLoading, setIsLoading] = useState(false);
  const skFile = useFileStore((s) => s.skFile);
  const gradeOptions = Array.from({ length: 10 }, (_, i) => ({ value: `D${i}`, label: `D${i}` }));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, skFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const { directSubordinates, ...rest } = formData;
      const payload = {
          name: rest.name,
          grade: rest.grade || null,
          jobDescription: rest.jobDescription || null,
          directSubordinates: directSubordinates.split(",").map((s) => s.trim()).filter(Boolean),
          memoNumber: rest.memoNumber,
          skFileId: skFile?.path || skFile?.name,
        };
      await positionsService.create(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalAddEdit
      title="Tambah Jabatan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={isLoading}
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
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Nama Jabatan"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="grade"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Grade
            </label>
            <Select
              options={gradeOptions}
              placeholder="Pilih Grade"
              onChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
              className=""
              defaultValue={formData.grade}
              required
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
              name="directSubordinates"
              id="directSubordinates"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Manager, dll"
              value={formData.directSubordinates}
              onChange={handleInputChange}
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
              name="memoNumber"
              id="memoNumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="SK-Dasaria/09/2025"
              value={formData.memoNumber}
              onChange={handleInputChange}
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
              name="jobDescription"
              id="jobDescription"
              rows={4}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter as description ..."
              value={formData.jobDescription}
              onChange={handleInputChange}
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
