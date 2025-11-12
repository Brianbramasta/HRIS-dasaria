import { useState } from "react";
import { Modal } from "../../../../../components/ui/modal/index";
import { positionService } from "../../../services/organization.service";
import { Position } from "../../../types/organization.types";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  position: Position | null;
};

export const DeletePositionModal = ({
  isOpen,
  onClose,
  onSuccess,
  position,
}: Props) => {
  const [skFile, setSkFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSkFile(e.target.files[0]);
      console.log(skFile)
    }
  };

  const handleDelete = async () => {
    if (!position) return;

    setIsLoading(true);
    try {
      await positionService.delete(position.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6 zoom-50"
      showCloseButton
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h1m0-4h-1v-2h1m-1 12a9 9 0 110-18 9 9 0 010 18z"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Hapus Data Jabatan
        </h3>
        <div>
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
        </div>
        <p className="text-sm text-gray-500">
          *Data tidak benar-benar dihapus akan tetapi diarsipkan
        </p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};