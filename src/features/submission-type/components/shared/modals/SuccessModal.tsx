import React from 'react';
import { Modal } from '@/components/ui/modal';

interface PopupBerhasilProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const PopupBerhasil: React.FC<PopupBerhasilProps> = ({ isOpen, onClose, title, description }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-2xl">
      <div className="flex flex-col items-center justify-center p-8 md:p-12">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-12 h-12 md:w-16 md:h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-8 max-w-lg">
          {description}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Selesai
        </button>
      </div>
    </Modal>
  );
};

export default PopupBerhasil;