import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Button from '@/components/ui/button/Button';
import {  Edit2 } from 'react-feather';
import PersonalDocumentsModal from '@/features/employee/components/modals/employee-data/personal-information/PersonalDocumentsModal';
import { IconFileDetail, IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';
import usePersonalDocumentsCard from '@/features/employee/hooks/card/usePersonalDocumentsCard';

interface Props {
  documents: any; // API response from employee-master-data
}

export default function PersonalDocumentsCard({ documents }: Props) {
  const {
    personalFiles,
    isOpen,
    openModal,
    closeModal,
    isComplete,
    initialData,
    handleSubmit,
  } = usePersonalDocumentsCard(documents);

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 ">
        <DocumentsTable
          items={personalFiles}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v, _row, idx) => idx + 1 },
            { id: 'fileType', label: 'Tipe File' },
            { id: 'jenis_file', label: 'Jenis File' },
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
        <Button variant="primary" size="sm" onClick={openModal} className='w-full md:w-auto flex items-center justify-center'>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <PersonalDocumentsModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={false}
      />
    </ExpandCard>
  );
}
