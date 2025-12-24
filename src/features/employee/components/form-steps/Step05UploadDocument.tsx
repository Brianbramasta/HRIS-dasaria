import React from 'react';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/button/Button';
import FileInput from '../../../../components/form/input/FileInput';
import { TrashBinIcon  } from '@/icons';
import {iconPlus as PlusIcon} from '@/icons/components/icons';
import DocumentsTable from '../../../structure-and-organize/components/table/TableGlobal';
import { useStep5Data } from '../../hooks/employee-data/form/useFromStep';


export const Step05UploadDocument: React.FC = () => {
  
  const { documentTypeOptions: DOCUMENT_TYPE_OPTIONS, rows, resetKey,step4, addRow, removeRow, handleTypeChange, handleFilesChange, handleUpload, handleRemoveDocument, getDocumentTypeLabel } = useStep5Data();
  

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Berkas / Dokumen</h3>
        <div className="">
          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div key={`${row.id}-${resetKey}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <Label>Tipe File</Label>
                  <Select
                    options={DOCUMENT_TYPE_OPTIONS}
                    defaultValue={row.tipeFile}
                    onChange={(value) => handleTypeChange(row.id, value)}
                    placeholder="Pilih Jenis Dokumen"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unggah file</label>
                  <FileInput multiple onChange={(e) => handleFilesChange(row.id, e)} />
                </div>
                <div className="md:col-span-1 flex items-center justify-end gap-2">
                { idx === 0  && (
                    <button
                    type="button"
                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600"
                    onClick={addRow}
                    aria-label="Tambah baris"
                  >
                    <PlusIcon size={20} />
                  </button>)}
                  {rows.length > 1 && idx!= 0 && (
                    <button
                      type="button"
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600"
                      onClick={() => removeRow(row.id)}
                      aria-label="Hapus baris"
                    >
                      <TrashBinIcon className="h-5 w-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={handleUpload}>Unggah</Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daftar Dokumen</h3>
        {(
          (step4?.documents || []).length > 0
        ) ? (
          <DocumentsTable
            items={(step4?.documents || []).map((doc, idx) => ({
              id: idx,
              tipeFile: doc.tipeFile,
              namaFile: doc.namaFile,
            }))}
            columns={[
              { id: 'no', label: 'No.', align: 'center', render: (_v, _row, i) => i + 1 },
              { id: 'tipeFile', label: 'Tipe File', render: (v) => getDocumentTypeLabel(String(v)) },
              { id: 'namaFile', label: 'Nama File' },
            ]}
            actions={[
              {
                label: 'Delete',
                icon: <TrashBinIcon className="h-5 w-5 text-[#000]" />,
                className: 'h-9 w-9 flex items-center justify-center rounded-lg text-white',
                onClick: (row: any) => handleRemoveDocument(Number(row.id)),
              },
            ]}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Tidak ada dokumen yang diupload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step05UploadDocument;
