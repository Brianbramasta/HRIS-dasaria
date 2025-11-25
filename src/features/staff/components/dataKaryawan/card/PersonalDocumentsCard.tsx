import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { Download, Eye, Edit2 } from 'react-feather';
import React from 'react';
import { useModal } from '@/hooks/useModal';
import PersonalDocumentsModal from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/PersonalDocumentsModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  documents: KaryawanDetailResponse['documents'];
}

export default function PersonalDocumentsCard({ documents }: Props) {
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ no: number; namaFile: string; dokumen: string }>>([]);
  const { isOpen, openModal, closeModal } = useModal(false);

  React.useEffect(() => {
    const mapped = (documents || []).map((d, idx) => ({ no: idx + 1, namaFile: d.namaFile || '', dokumen: d.tipeFile || '' }));
    setPersonalFiles(mapped);
  }, [documents]);

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 ">
        <Table className="min-w-[640px] md:min-w-full">
          <TableHeader>
            <TableRow className="bg-brand-900 text-white">
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                No.
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Nama File
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Dokumen
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalFiles?.length ? (
              personalFiles.map((f) => (
                <TableRow key={f.no} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 text-center text-sm">{f.no}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{f.namaFile}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{f.dokumen}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Download size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key="no-files" className="border-b border-gray-100 dark:border-gray-800">
                <TableCell colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada berkas/dokumen pribadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
          // sinkronkan ke tabel dummy di card untuk preview
          const mapped = payload.rows.map((r, idx) => ({ no: idx + 1, namaFile: r.tipeFile, dokumen: r.namaFile }));
          setPersonalFiles(mapped);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}