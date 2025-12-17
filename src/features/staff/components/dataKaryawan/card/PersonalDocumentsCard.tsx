import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Button from '@/components/ui/button/Button';
import {  Edit2 } from 'react-feather';
import React from 'react';
import { useModal } from '@/hooks/useModal';
import PersonalDocumentsModal from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/PersonalDocumentsModal';
import { IconFileDetail, IconHapus, IconLengkap, IconPencil, IconTidakLengkap } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';

interface Props {
  documents: any; // API response from employee-master-data
}

export default function PersonalDocumentsCard({ documents }: Props) {
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ id: number | string; no: number; namaFile: string; dokumen: string }>>([]);
  const { isOpen, openModal, closeModal } = useModal(false);

  React.useEffect(() => {
    // Note: API response doesn't have documents field in the current contract
    // This is a placeholder implementation
    const docs = documents?.documents || [];
    const mapped = docs.map((d: any, idx: number) => ({
      id: d.id || idx + 1,
      no: idx + 1,
      namaFile: d.name_file || '',
      fileType: d.file_type || '',
      fileUrl: d.file || '',
    }));
    console.log('Mapped documents', mapped);
    setPersonalFiles(mapped);
  }, [documents]);

  const isComplete = Array.isArray(documents?.documents) && documents.documents.length > 0 && documents.documents.every((d: any) => !!d?.file_name && !!d?.file_type);

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 ">
        <DocumentsTable
          items={personalFiles}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v, _row, idx) => idx + 1 },
            { id: 'fileType', label: 'Tipe File' },
            { id: 'namaFile', label: 'Nama File' },
          ]}
          actions={[
            {
              icon: <IconHapus size={16} />,
              className: ' border-gray-300 text-sm hover:bg-gray-50',
              onClick: () => {},
            },
            {
              icon: <IconFileDetail size={16} />,
              className: ' border-gray-300 text-sm hover:bg-gray-50',
              onClick: (row: any) => {
                console.log('View clicked', row);
                console.log('View clicked dokuments', documents);
                window.open(formatUrlFile(row.fileUrl), '_blank'); 
              },
            },
            {
              icon: <IconPencil size={16} />,
              className: ' border-gray-300 text-sm hover:bg-gray-50',
              onClick: () => {},
            },
          ]}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <PersonalDocumentsModal
        isOpen={isOpen}
        initialData={{ tipeFile: '', pendingRows: [{ tipeFile: '', fileName: '' }], rows: [] }}
        onClose={closeModal}
        onSubmit={(payload) => {
          const mapped = payload.rows.map((r, idx) => ({ id: idx + 1, no: idx + 1, namaFile: r.tipeFile, dokumen: r.namaFile }));
          setPersonalFiles(mapped);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
