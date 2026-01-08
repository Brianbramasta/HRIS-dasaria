import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 10 * 1024 * 1024;

export function useUploadExcelModal(args: {
  onImport?: (file: File) => Promise<void> | void;
  submitting?: boolean;
}) {
  const { onImport, submitting = false } = args;

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError('');
    if (fileRejections?.length) {
      const first = fileRejections[0];
      const msg = first?.errors?.[0]?.message || 'File tidak valid';
      setError(msg);
      setFile(null);
      return;
    }
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_SIZE,
    accept: { 'text/csv': ['.csv'] },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || submitting) return;
    await onImport?.(file);
  };

  return {
    file,
    setFile,
    error,
    getRootProps,
    getInputProps,
    isDragActive,
    handleSubmit,
  };
}
