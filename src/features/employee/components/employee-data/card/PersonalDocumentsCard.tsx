import { useState } from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DataTable from '@/components/shared/datatable/DataTable';
import { IconLengkap, IconPencil, IconTidakLengkap } from '@/icons/components/icons';
import { IconFileDetail } from '@/icons/components/icons';
import EditDocumentModal from '@/features/employee/components/modals/employee-data/personal-information/EditDocumentModal';
import { ColumnFilterOption } from '@/components/shared/datatable/filter-column/ColumnFilterPopup';
import { EmployeeDocumentItem } from '@/features/employee/types/detail/PersonalInformation';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { handleViewFile } from '@/utils/viewFileHandle';
import { addNotification } from '@/stores/notificationStore';

interface Props {
  documents: EmployeeDocumentItem[];
  employeeId: string;
}

export default function PersonalDocumentsCard({ documents, employeeId }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  // Initialize personal information hook
  const {uploadEmployeeDocument, loading } = usePersonalInformation(employeeId);
  
  // Transform document data to match table structure
  const tableData = documents.map((doc, index) => ({
    id: doc.file_type_id,
    tipeFile: doc.file_type,
    jenisFile: doc.jenis_file,
    catatan: doc.note,
    statusDokumen: doc.status === 'Sudah Upload' ? 'sudah_upload' : 'belum_upload',
    fileUrl: doc.file,
    _index: index
  }));

  // Check if all documents are uploaded
  const isComplete = documents.every(doc => doc.status === 'Sudah Upload');

  // Filter options for Jenis File column
  const jenisFileOptions: ColumnFilterOption[] = [
    ...new Map(
      documents.map(doc => [doc.jenis_file, { 
        label: doc.jenis_file, 
        value: doc.jenis_file 
      }])
    ).values()
  ];

  const handleEditDocument = (row: any) => {
    // Find the original document data from the documents array using file_type_id
    const originalDocument = documents.find(doc => doc.file_type_id === row.id);
    console.log(originalDocument?.file_type_id,'originalDocument?.file_type_id')
    console.log(documents)
    console.log(row.id,'row.id')
    // Set selected document with proper field mapping for the modal
    setSelectedDocument({
      id: originalDocument?.file_type_id,
      jenisFile: originalDocument?.jenis_file || row.jenisFile,
      tipeFile: originalDocument?.file_type || row.tipeFile,
      catatan: originalDocument?.note || row.catatan,
      fileUrl: originalDocument?.file || row.fileUrl,
      file_type_id: originalDocument?.file_type_id,
      statusDokumen: row.statusDokumen
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedDocument(null);
  };

  const handleSubmitDocument = async (data: any) => {
    console.log('Submitting document data:', data);
    
    try {
      if (data.file_type_id && (data.document || data.note)) {
        // Upload new document or update note
        const uploadResult = await uploadEmployeeDocument(employeeId, {
          file_type_id: data.file_type_id,
          document: data.document,
          note: data.note
        });
        console.log(uploadResult,'uploadResult')
        
        if (uploadResult) {
          console.log('Document uploaded successfully:', uploadResult);
          // Modal will be closed and data will be refetched automatically
          handleCloseModal();
        } else {
          addNotification({
            variant: 'error',
            title: 'Gagal Mengunggah Dokumen',
            description: 'Terjadi kesalahan saat mengunggah dokumen. Silakan coba lagi.'
          });
        }
      } else {
        addNotification({
          variant: 'warning',
          title: 'Data Tidak Lengkap',
          description: 'Harap unggah dokumen atau isi catatan sebelum menyimpan.'
        });
      }
    } catch (error) {
      addNotification({
        variant: 'error',
        title: 'Error',
        description: 'Terjadi kesalahan saat memproses dokumen. Silakan coba lagi.'
      });
    }
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

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />}  withHeaderDivider>
      <div className="grid grid-cols-1 gap-4">
        <DataTable
          border={false}
          resetKey='personal-documents'
          data={tableData}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'tipeFile', label: 'Tipe File', sortable: true },
            { 
              id: 'jenisFile', 
              label: 'Jenis File',
              sortable: true,
              filterOptions: jenisFileOptions
            },
            { id: 'catatan', label: 'Catatan', sortable: true },
            { 
              id: 'statusDokumen', 
              label: 'Status Dokumen',
              sortable: true,
              filterOptions: [
                { label: 'Sudah Upload', value: 'sudah_upload' },
                { label: 'Belum Upload', value: 'belum_upload' }
              ],
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
              condition: (row: any) => row.statusDokumen === 'sudah_upload',
              onClick: (row: any) => {
                handleViewFile(row);
              },
            },
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari dokumen..."
          emptyMessage="Tidak ada data dokumen"
          disablePagination={true}
          clientSide={true}
        />
      </div>
      {/* <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" className='w-full md:w-auto flex items-center justify-center'>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div> */}
      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        initialData={selectedDocument}
        onSubmit={handleSubmitDocument}
        submitting={loading}
      />
    </ExpandCard>
  );
}
