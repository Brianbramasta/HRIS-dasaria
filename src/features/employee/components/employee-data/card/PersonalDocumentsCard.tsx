import { useState } from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DataTable from '@/components/shared/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { IconLengkap, IconPencil, IconTidakLengkap } from '@/icons/components/icons';
import { IconFileDetail } from '@/icons/components/icons';
import EditDocumentModal from '@/features/employee/components/modals/employee-data/personal-information/EditDocumentModal';
import { ColumnFilterOption } from '@/components/shared/datatable/filter-column/ColumnFilterPopup';

export default function PersonalDocumentsCard() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  const dummyData = [
    {
      id: 1,
      tipeFile: 'Foto',
      jenisFile: 'Foto Terbaru',
      catatan: 'Foto berwarna background biru',
      statusDokumen: 'sudah_upload',
      fileUrl: '#'
    },
    {
      id: 2,
      tipeFile: 'Identitas',
      jenisFile: 'Kartu Tanda Penduduk',
      catatan: 'KTP masih berlaku',
      statusDokumen: 'sudah_upload',
      fileUrl: '#'
    },
    {
      id: 3,
      tipeFile: 'Pendidikan',
      jenisFile: 'Ijazah Terakhir',
      catatan: 'Ijazah S1',
      statusDokumen: 'belum_upload',
      fileUrl: '#'
    },
    {
      id: 4,
      tipeFile: 'Keluarga',
      jenisFile: 'Kartu Keluarga',
      catatan: 'KK terbaru',
      statusDokumen: 'sudah_upload',
      fileUrl: '#'
    },
    {
      id: 5,
      tipeFile: 'Asuransi',
      jenisFile: 'BPJS Kesehatan',
      catatan: 'BPJS Kesehatan aktif',
      statusDokumen: 'belum_upload',
      fileUrl: '#'
    },
    {
      id: 6,
      tipeFile: 'Asuransi',
      jenisFile: 'BPJS Ketenagakerjaan',
      catatan: 'BPJS Ketenagakerjaan aktif',
      statusDokumen: 'sudah_upload',
      fileUrl: '#'
    }
  ];

  // Add index to data for numbering
  const dataWithIndex = dummyData.map((item, index) => ({ ...item, _index: index }));

  // Filter options for Jenis File column
  const jenisFileFilterOptions: ColumnFilterOption[] = [
    { label: 'Foto Terbaru', value: 'Foto Terbaru' },
    { label: 'Kartu Tanda Penduduk', value: 'Kartu Tanda Penduduk' },
    { label: 'Ijazah Terakhir', value: 'Ijazah Terakhir' },
    { label: 'Kartu Keluarga', value: 'Kartu Keluarga' },
    { label: 'BPJS Kesehatan', value: 'BPJS Kesehatan' },
    { label: 'BPJS Ketenagakerjaan', value: 'BPJS Ketenagakerjaan' },
  ];

  const handleEditDocument = (row: any) => {
    setSelectedDocument(row);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedDocument(null);
  };

  const handleSubmitDocument = (data: any) => {
    console.log('Submitting document data:', data);
    // Here you would typically update the data
    handleCloseModal();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'sudah_upload') {
      return (
        <span className="status-styling inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Sudah Upload
        </span>
      );
    } else {
      return (
        <span className="status-styling inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Belum Upload
        </span>
      );
    }
  };
  const isComplete = false;
  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />}  withHeaderDivider>
      <div className="grid grid-cols-1 gap-4">
        <DataTable
          data={dataWithIndex}
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'tipeFile', label: 'Tipe File' },
            { 
              id: 'jenisFile', 
              label: 'Jenis File',
              filterOptions: jenisFileFilterOptions
            },
            { id: 'catatan', label: 'Catatan' },
            { 
              id: 'statusDokumen', 
              label: 'Status Dokumen',
              format: (_v: any, row: any) => getStatusBadge(row.statusDokumen)
            },
          ]}
          actions={[
            {
              icon: <IconPencil />,
              onClick: (row: any) => {
                handleEditDocument(row);
              },
            },
            {
              icon: <IconFileDetail />,
              onClick: (row: any) => {
                console.log('View file:', row.jenisFile);
              },
            },
          ]}
          filterable={true}
          emptyMessage="Tidak ada data dokumen"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" className='w-full md:w-auto flex items-center justify-center'>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>
      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        initialData={selectedDocument}
        onSubmit={handleSubmitDocument}
        submitting={false}
      />
    </ExpandCard>
  );
}
