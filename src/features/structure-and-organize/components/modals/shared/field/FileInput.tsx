import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileStore , setSkFile } from '@/stores/fileStore';
import { clearSkFile } from '@/stores/fileStore';

interface FileInputProps {
  skFileName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ skFileName, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [savedInfo, setSavedInfo] = useState<{ fileName: string; filePath: string; size: number } | null>(null);
  const skFile =  useFileStore((s) => s.skFile);;

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Local preview as immediate feedback
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Emit change for parent consumers (existing behavior)
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach(f => dataTransfer.items.add(f));
      const syntheticEvent = {
        target: {
          files: dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);

      // Store file locally in state/store; actual upload happens on Save
      setSavedInfo({ fileName: file.name, filePath: localPreview, size: file.size });
      setSkFile({ name: file.name, path: localPreview, size: file.size, type: file.type, file });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
      'application/pdf': [],
    },
    noClick: false,
  });

  const handleClear = () => {
    setPreview(null);
    setSavedInfo(null);
    clearSkFile();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload File SK terbaru</label>
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
          ${
            isDragActive
              ? 'border-brand-500 bg-gray-100 dark:bg-gray-800'
              : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
          }
        `}
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? 'Drop Files Here' : 'Drag & Drop Files Here'}
            </h4>

            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </form>
      </div>
      {skFile?.path && skFile?.type?.startsWith('image/') && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Preview:</div>
          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-2">
            <img 
              src={skFile?.path} 
              alt="Preview" 
              className="max-w-full h-auto max-h-64 mx-auto object-contain"
            />
          </div>
          {savedInfo && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">File:</span> {savedInfo.fileName} · <span className="font-medium">Size:</span> {Math.round(savedInfo.size / 1024)} KB
            </div>
          )}
        </div>
      )}
      {skFile?.path && !skFile?.type?.startsWith('image/') && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Preview:</div>
          <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 flex items-center gap-3">
            <img
              src={skFile?.type === 'application/pdf' ? '/images/icons/file-pdf.svg' : '/images/icons/file-image.svg'}
              alt="File"
              className="w-8 h-8"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800 dark:text-white/90">{skFile?.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{Math.round((savedInfo?.size || skFile.size) / 1024)} KB · {skFile?.type}</div>
            </div>
            <a href={skFile?.path} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Open</a>
          </div>
        </div>
      )}
      {(savedInfo?.fileName || skFileName) && (
        <div className="mt-2 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Selected:</span> {savedInfo?.fileName || skFileName}
            </p>
          </div>
          <button type="button" onClick={handleClear} className="text-xs text-red-600 hover:underline">Remove</button>
        </div>
      )}
    </div>
  );
};

export default FileInput;
