import React, { useRef } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Select from '../../../../components/ui/select/Select';
import Button from '../../../../components/ui/button/Button';
import { Trash2, Plus } from 'react-feather';
import { DocumentItem } from '../../types/FormulirKaryawan';

const DOCUMENT_TYPE_OPTIONS = [
  { label: 'Kartu Tanda Penduduk', value: 'ktp' },
  { label: 'Ijazah Terakhir', value: 'ijazah' },
  { label: 'Kartu Keluarga', value: 'kk' },
  { label: 'BPJS Kesehatan', value: 'bpjs_kesehatan' },
  { label: 'BPJS Ketenagakerjaan', value: 'bpjs_ketenagakerjaan' },
  { label: 'NPWP', value: 'npwp' },
  { label: 'Sertifikat Keahlian', value: 'sertifikat' },
  { label: 'Dokumen Lainnya', value: 'lainnya' },
];

export const Step4UploadDocument: React.FC = () => {
  const { formData, updateStep4 } = useFormulirKaryawanStore();
  const step4 = formData.step4;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = React.useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedType) {
      const newDocument: DocumentItem = {
        tipeFile: selectedType,
        namaFile: file.name,
        file: file,
        filePath: URL.createObjectURL(file),
      };

      const documents = step4.documents || [];
      updateStep4({
        documents: [...documents, newDocument],
      });

      setSelectedType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = (index: number) => {
    const documents = step4.documents || [];
    const newDocuments = documents.filter((_, i) => i !== index);
    updateStep4({
      documents: newDocuments,
    });
  };

  const handleAddClick = () => {
    if (selectedType && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Berkas / Dokumen
        </h3>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Document Type Select */}
            <div>
              <Select
                label="Tipe File"
                options={DOCUMENT_TYPE_OPTIONS}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                placeholder="Pilih Jenis Dokumen"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload File
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <input
                  type="text"
                  placeholder="Tidak ada file yang dipilih"
                  disabled
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddClick}
              disabled={!selectedType}
              className="flex items-center justify-center gap-2 py-2.5 h-full"
              variant="primary"
              size="sm"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daftar Dokumen
        </h3>

        {(step4.documents || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900 dark:bg-blue-950 text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium">No.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tipe File</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nama File</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {(step4.documents || []).map((doc, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {getDocumentTypeLabel(doc.tipeFile)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {doc.namaFile}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveDocument(index)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Tidak ada dokumen yang diupload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4UploadDocument;
