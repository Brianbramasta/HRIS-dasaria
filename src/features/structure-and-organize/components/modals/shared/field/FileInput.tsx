import React from 'react';


interface FileInputProps {
  skFileName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ skFileName,  onChange}) => {
  

  return (
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK terbaru</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">⬆️</span>
            </div>
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm text-gray-500">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <label className="mt-3 inline-block cursor-pointer text-primary underline">
              <input type="file" className="hidden" onChange={onChange} />
              Browser File
            </label>
            {(skFileName) && (
              <p className="mt-2 text-sm text-gray-600">Selected: {skFileName}</p>
            )}
          </div>
        </div>
  );
};

export default FileInput;