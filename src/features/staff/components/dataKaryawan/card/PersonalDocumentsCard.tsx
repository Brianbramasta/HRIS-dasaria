import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Button from '@/components/ui/button/Button';
import { Download, Eye, Edit2 } from 'react-feather';
import React from 'react';
import { useModal } from '@/hooks/useModal';
import PersonalDocumentsModal from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/PersonalDocumentsModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  documents: KaryawanDetailResponse['documents'];
}

export default function PersonalDocumentsCard({ documents }: Props) {
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ id: number | string; no: number; namaFile: string; dokumen: string }>>([]);
  const { isOpen, openModal, closeModal } = useModal(false);

  React.useEffect(() => {
    const mapped = (documents || []).map((d, idx) => ({ id: idx + 1, no: idx + 1, namaFile: d.namaFile || '', dokumen: d.tipeFile || '' }));
    setPersonalFiles(mapped);
  }, [documents]);

  const isComplete = Array.isArray(documents) && documents.length > 0 && documents.every((d: any) => !!d?.namaFile && !!d?.tipeFile);

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 ">
        <DocumentsTable
          items={personalFiles}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v, _row, idx) => idx + 1 },
            { id: 'namaFile', label: 'Nama File' },
            { id: 'dokumen', label: 'Dokumen' },
          ]}
          actions={[
            {
              icon: <Eye size={16} />,
              className: 'rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50',
              onClick: () => {},
            },
            {
              icon: <Download size={16} />,
              className: 'rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50',
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
