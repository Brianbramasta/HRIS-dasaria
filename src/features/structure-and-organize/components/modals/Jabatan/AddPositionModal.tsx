import { useState } from "react";
import { Modal } from "../../../../../components/ui/modal/index";
import { positionsService } from "../../../services/request/positions.service";
import { useFileStore } from '@/stores/fileStore';
import FileInput from "../shared/field/FileInput";
import Input from "@/components/form/input/InputField";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6 zoom-50"
      showCloseButton
    >
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
          Tambah Jabatan
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Input
              required
              type="text"
              name="grade"
              id="grade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="DO"
              value={formData.grade}
              onChange={handleInputChange}
              
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
          {/* <div>
            <label
              htmlFor="skFile"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Upload File SK
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Drop File Here</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Drag and drop your PNG, JPG, WebP, SVG images here or browse
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div> */}
          <FileInput 
            onChange={handleFileChange}
            skFileName={skFile?.name || ''}
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};