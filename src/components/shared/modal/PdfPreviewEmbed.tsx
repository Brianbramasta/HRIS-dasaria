import { useState } from 'react';

interface PdfPreviewEmbedProps {
  fileUrl?: string;
  className?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export default function PdfPreviewEmbed({ fileUrl, className = '', onError, onSuccess }: PdfPreviewEmbedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('PdfPreviewEmbed fileUrl:', fileUrl);

  if (!fileUrl) {
    return (
      <div className={`rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400 p-4">
          <p className="text-sm">Tidak ada file PDF</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center ${className}`}>
      {error && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-600 p-4">
            <p className="text-sm font-semibold">Gagal memuat PDF</p>
            <p className="text-xs mt-1">{error}</p>
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Buka di Tab Baru
            </button>
          </div>
        </div>
      )}

      {!error && (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-full rounded-lg"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError('Gagal memuat preview PDF. Klik untuk membuka di tab baru.');
            onError?.(new Error('PDF load failed'));
          }}
          title="PDF Preview"
        />
      )}
    </div>
  );
}
