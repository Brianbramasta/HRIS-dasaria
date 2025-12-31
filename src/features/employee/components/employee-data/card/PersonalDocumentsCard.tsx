import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Button from '@/components/ui/button/Button';
import {  Edit2 } from 'react-feather';
import React from 'react';
import { useModal } from '@/hooks/useModal';
import PersonalDocumentsModal from '@/features/employee/components/modals/employee-data/personal-information/PersonalDocumentsModal';
import { IconFileDetail, IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useParams } from 'react-router-dom';
import usePersonalInformation from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';

interface Props {
  documents: any; // API response from employee-master-data
}

export default function PersonalDocumentsCard({ documents }: Props) {
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ id: number | string; no: number; namaFile: string; dokumen: string }>>([]);
  const { isOpen, openModal, closeModal } = useModal(false);
  const { id } = useParams<{ id: string }>();
  const { updateEmployeeDocument } = usePersonalInformation(id);

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

  const optionalType = 'Surat Keterangan Pengalaman Kerja';
  const existingTypes = new Set((documents?.documents || []).map((d: any) => d.file_type));
  console.log('Existing types', existingTypes);
  console.log('Has optional', existingTypes.has(optionalType));
  console.log('Documents length', documents?.documents.length === 12 && !existingTypes.has(optionalType));

  const isComplete = documents?.documents.length > 12 ? true : documents?.documents.length === 12 && !existingTypes.has(optionalType);

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
            // {
            //   icon: <IconHapus />,
            //   className: ' border-gray-300 text-sm hover:bg-gray-50',
            //   onClick: () => {},
            // },
            {
              icon: <IconFileDetail />,
              className: ' border-gray-300 text-sm hover:bg-gray-50',
              onClick: (row: any) => {
                console.log('View clicked', row);
                console.log('View clicked dokuments', documents);
                window.open(formatUrlFile(row.fileUrl), '_blank'); 
              },
            },
            // {
            //   icon: <IconPencil  />,
            //   className: ' border-gray-300 text-sm hover:bg-gray-50',
            //   onClick: () => {},
            // },
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
        // Dokumentasi: Inisialisasi data modal dokumen dari response Document_Data.documents
        initialData={{
          tipeFile: '',
          pendingRows: [{ tipeFile: '', fileName: '' }],
          rows: (documents?.documents || []).map((d: any, idx: number) => ({
            id: idx + 1,
            document_id: d?.id || '',
            tipeFile: d?.file_type || '',
            type_id: d?.file_type_id || '',
            namaFile: d?.name_file || '',
            filePath: d?.file || '',
          })),
        }}
        onClose={closeModal}
        onSubmit={async (payload) => {
          // Dokumentasi: Bangun payload dokumen dengan tipe aman (id & file hanya dikirim jika ada)
          const documentsPayload = {
            documents: (payload.rows || []).map((r) => {
              const item: any = {
                document_type_id: String(r.type_id),
              };
              if (r.document_id) item.id = String(r.document_id);
              if (r.file) item.file = r.file;
              return item;
            }),
          };
          await updateEmployeeDocument(id as string, documentsPayload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
