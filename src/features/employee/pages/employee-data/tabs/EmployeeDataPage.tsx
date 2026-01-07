

import { DataTable, DataTableColumn, DataTableAction } from '../../../../../components/shared/datatable/DataTable';
import {  Karyawan } from '../../../types/Employee';
import useKaryawan from '../../../hooks/employee-data/list/useKaryawan';
// import Button from '../../../../../components/ui/button/Button';
import AddKaryawanModal from '../../../components/modals/AddEmployeeModal';
import DeleteKaryawanModal from '../../../components/modals/employee-data/DeleteEmployeeModal';
import ShareLinkModal from '../../../components/modals/sharelink/ShareLinkModal';
import { IconFileDetail, IconHapus } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import { getEmployeeStatusDropdownOptions, DropdownOption } from '../../../hooks/employee-data/form/useFormulirKaryawan';


// Helper function for rendering remaining contract badge
const renderSisaKontrakBadge = (sisaKontrak: string | undefined) => {
  console.log('sisaKontrak:', sisaKontrak);
  if (!sisaKontrak) {
    return <span className="status-styling rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">-</span>;
  }

  const sisaKontrakStr = sisaKontrak.toString().toLowerCase().trim();

  // Determine badge color based on the value
  let bgClass = '';
  let textClass = '';

  if (sisaKontrakStr === 'berakhir') {
    // Merah = Berakhir
    bgClass = 'bg-red-100';
    textClass = 'text-red-800';
  } else if (sisaKontrakStr.includes('hari')) {
    // Merah = Kurang dari 1 bulan (1-6 hari)
    bgClass = 'bg-pink-100';
    textClass = 'text-pink-800';
  } else if (sisaKontrakStr.includes('minggu')) {
    // Merah/Pink = Kurang dari 1 bulan (1-4 minggu)
    bgClass = 'bg-pink-100';
    textClass = 'text-pink-800';
  } else if (sisaKontrakStr.includes('bulan')) {
    // Extract bulan number to determine color
    const match = sisaKontrakStr.match(/(\d+)/);
    if (match) {
      const bulanNum = parseInt(match[1]);
      if (bulanNum <= 2) {
        // Orange = 1-2 Bulan
        bgClass = 'bg-orange-100';
        textClass = 'text-orange-800';
      } else if (bulanNum >= 3 && bulanNum <= 6) {
        // Biru = 3-6 Bulan
        bgClass = 'bg-blue-100';
        textClass = 'text-blue-800';
      } else if (bulanNum > 6) {
        // Hijau = Lebih dari 6 Bulan
        bgClass = 'bg-green-100';
        textClass = 'text-green-800';
      }
    }
  } else {
    bgClass = 'bg-gray-300';
    textClass = 'text-[#404040]';
  }

  return <span className={`status-styling rounded-full px-3 py-1 text-xs font-medium ${bgClass} ${textClass}`}>{sisaKontrak}</span>;
};

// Helper function for employment status badge with color mapping
const renderEmploymentStatusBadge = (value: string | undefined) => {
  if (!value) {
    return <span className="inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800">-</span>;
  }

  const statusValue = value.toLowerCase().trim();
  let bgClass = '';
  let textClass = '';

  if (statusValue === 'aktif' || statusValue === 'active') {
    bgClass = 'bg-green-100';
    textClass = 'text-green-800';
  } else if (statusValue === 'pengunduran diri' || statusValue === 'resign') {
    bgClass = 'bg-blue-100';
    textClass = 'text-blue-800';
  } else if (statusValue === 'tidak aktif' || statusValue === 'inactive') {
    bgClass = 'bg-red-100';
    textClass = 'text-red-800';
  } else if (statusValue === 'evaluasi' || statusValue === 'evaluation') {
    bgClass = 'bg-orange-100';
    textClass = 'text-orange-800';
  } else {
    bgClass = 'bg-gray-100';
    textClass = 'text-gray-800';
  }

  return (
    <span className={`inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`}>
      {value}
    </span>
  );
};

// Helper function for payroll status badge
const renderPayrollStatusBadge = (value: string | undefined) => {
  if (!value) {
    return <span className="inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800">-</span>;
  }

  const statusValue = value.toLowerCase().trim();
  const bgClass = (statusValue === 'aktif' || statusValue === 'active') ? 'bg-green-100' : 'bg-red-100';
  const textClass = (statusValue === 'aktif' || statusValue === 'active') ? 'text-green-800' : 'text-red-800';

  return (
    <span className={`inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`}>
      {value}
    </span>
  );
};

// Helper function for employee data status badge
const renderEmployeeDataStatusBadge = (value: string | undefined) => {
  if (!value) {
    return <span className="inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800">-</span>;
  }

  const statusValue = value.toLowerCase().trim();
  const bgClass = (statusValue === 'lengkap' || statusValue === 'complete') ? 'bg-green-100' : 'bg-red-100';
  const textClass = (statusValue === 'lengkap' || statusValue === 'complete') ? 'text-green-800' : 'text-red-800';

  return (
    <span className={`inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`}>
      {value}
    </span>
  );
};

export default function DataKaryawanPage() {
  const {
    data,
    loading,
    // error,
    total,
    page,
    limit,
    navigate,
    // fetchKaryawan,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    // Modal states
    selectedKaryawan,
    // showDetailModal,
    showAddModal,
    showShareModal,
    showDeleteModal,
    deleteSubmitting,
    shareUrl,
    // Modal handlers
    handleAddKaryawan,
    handleExportKaryawan,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddModalClose,
    handleAddManual,
    handleImportFile,
    handleShareModalClose,
    handleDeleteModalClose,
    // setShowDetailModal,
    // setSelectedKaryawan,
    // Column filters
    columnFilters,
    handleColumnFilterChange,
    // Date range filters
    dateRangeFilters,
    handleDateRangeFilterChange,
  } = useKaryawan({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
  });

  const [employmentStatusFilterOptions, setEmploymentStatusFilterOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const loadStatusOptions = async () => {
      const opts = await getEmployeeStatusDropdownOptions();
      const mapped = (opts || []).map((o) => ({ label: o.label, value: o.value }));
      setEmploymentStatusFilterOptions(mapped);
    };
    loadStatusOptions();
  }, []);

  // Define columns and actions for DataTable
  const columns: DataTableColumn<Karyawan>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
      format: (_, row) => {
        const index = data.indexOf(row) + 1 + (page - 1) * limit;
        return index;
      },
    },
    {
      id: 'id',
      label: 'NIP',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'full_name',
      label: 'Pengguna',
      minWidth: 150,
      sortable: true,
      format: (_, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.full_name}`}
            alt={row.full_name}
            className="h-8 w-8 rounded-full"
          />
          <span>{row.full_name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 180,
      sortable: true,
      format: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ),
    },
    {
      id: 'birth_date',
      label: 'Tanggal Lahir',
      minWidth: 130,
      sortable: true,
      filterOptions: [
        { label: 'Januari', value: '1' },
        { label: 'Februari', value: '2' },
        { label: 'Maret', value: '3' },
        { label: 'April', value: '4' },
        { label: 'Mei', value: '5' },
        { label: 'Juni', value: '6' },
        { label: 'Juli', value: '7' },
        { label: 'Agustus', value: '8' },
        { label: 'September', value: '9' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Desember', value: '12' },
      ],
      format: (_, row) => formatDateToIndonesian(row.birth_date as string) || '-',
    },
    {
      id: 'start_date',
      label: 'Tanggal Masuk',
      minWidth: 130,
      sortable: true,
      dateRangeFilter: true,
      format: (_, row) => formatDateToIndonesian(row.start_date as string) || '-',
    },
    {
      id: 'end_date',
      label: 'Tanggal Berakhir',
      minWidth: 140,
      sortable: true,
      dateRangeFilter: true,
      format: (value) => formatDateToIndonesian(value as string) || '-',
    },
    {
      id: 'contract_remaining',
      label: 'Sisa Kontrak',
      minWidth: 130,
      sortable: false,
      filterOptions: [
        { label: '< 1 Bulan', value: 'less_than_1_month' },
        { label: '1–2 Bulan', value: '1_to_2_months' },
        { label: '3–6 Bulan', value: '3_to_6_months' },
        { label: '> 6 Bulan', value: 'more_than_6_months' },
      ],
      format: (value) => renderSisaKontrakBadge(value),
    },
    {
      id: 'company',
      label: 'Perusahaan',
      minWidth: 150,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'office',
      label: 'Kantor',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'job_title',
      label: 'Jabatan',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'position_level',
      label: 'Jenjang Jabatan',
      minWidth: 140,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'grade',
      label: 'Golongan',
      minWidth: 100,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'position',
      label: 'Posisi',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'department',
      label: 'Departemen',
      minWidth: 130,
      sortable: true,
      format: (_, row) => row.department || '-',
    },
    {
      id: 'division',
      label: 'Divisi',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'directorate',
      label: 'Direktorat',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'employment_status_id',
      label: 'Status Karyawan',
      minWidth: 130,
      sortable: true,
      filterOptions: employmentStatusFilterOptions,
      format: (_, row) => renderEmploymentStatusBadge(row.employment_status as string),
    },
    {
      id: 'payroll_status',
      label: 'Status Payroll',
      minWidth: 120,
      sortable: true,
      filterOptions: [
        { label: 'Aktif', value: 'Aktif' },
        { label: 'Tidak Aktif', value: 'Tidak Aktif' },
      ],
      format: (value) => renderPayrollStatusBadge(value),
    },
    {
      id: 'employee_data_status',
      label: 'Status Data Karyawan',
      minWidth: 150,
      sortable: true,
      filterOptions: [
        { label: 'Lengkap', value: 'Lengkap' },
        { label: 'Belum Lengkap', value: 'Belum Lengkap' },
      ],
      format: (value) => renderEmployeeDataStatusBadge(value),
    },
    {
      id: 'employee_category',
      label: 'Kategori Karyawan',
      minWidth: 140,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'user_access',
      label: 'Hak Akses',
      minWidth: 120,
      sortable: true,
      format: (_, row) => row.user_access || '-',
    },
    {
      id: 'detail',
      label: 'Detail Profile',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <button
          onClick={() => navigate(`/employee-data/${row.id}?mode=view`)}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Detail Profile"
        >
          <IconFileDetail />
        </button>
      ),
    },
  ];

  const actions: DataTableAction<Karyawan>[] = [
    {
      icon: <IconHapus />,
      onClick: handleDeleteClick,
      variant: 'outline',
      color: 'error',
    },
  ];

  // if (error) {
  //   return (
  //     <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
  //       <p className="font-semibold mb-2">Error: {error}</p>
  //       <Button onClick={() => fetchKaryawan()} variant="primary" size="sm" className="mt-2">
  //         Coba Lagi
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title="Data Master Karyawan"
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={limit}
        pageSizeOptions={[5, 10, 25, 50]}
        onAdd={handleAddKaryawan}
        addButtonLabel="Tambah Karyawan"
        onExport={handleExportKaryawan}
        exportButtonLabel="Ekspor"
        filterable={true}
        loading={loading}
        emptyMessage="Tidak ada data karyawan"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        useExternalPagination={true}
        externalPage={page}
        externalTotal={total}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        resetKey="DataMasterKaryawan"
      />

      {/* Add Karyawan Modal */}
      <AddKaryawanModal
        isOpen={showAddModal}
        onClose={handleAddModalClose}
        onAddManual={handleAddManual}
        onImportFile={handleImportFile}
      />

      <ShareLinkModal
        isOpen={showShareModal}
        onClose={handleShareModalClose}
        link={shareUrl}
      />

      <DeleteKaryawanModal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        karyawan={selectedKaryawan || undefined}
        handleDelete={handleConfirmDelete}
        submitting={deleteSubmitting}
      />

      {/* Detail Modal */}
      {/* {showDetailModal && selectedKaryawan && (
        <DetailKaryawanModal
          karyawan={selectedKaryawan}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedKaryawan(null);
          }}
        />
      )} */}
    </div>
  );
}

// Simple Detail Modal Component
// function DetailKaryawanModal({
//   karyawan,
//   isOpen,
//   onClose,
// }: {
//   karyawan: Karyawan;
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//         >
//           <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Detail Karyawan</h2>

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* Avatar */}
//           <div className="col-span-2 flex justify-center">
//             <img
//               src={karyawan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${karyawan.name}`}
//               alt={karyawan.name}
//               className="h-32 w-32 rounded-full"
//             />
//           </div>

//           {/* Information Grid */}
//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">NIP</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.idKaryawan}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.name}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.email}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Posisi</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.posisi}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jabatan</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.jabatan}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Perusahaan</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.company}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Departemen</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.department || '-'}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kantor</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.office || '-'}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Join</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.tanggalJoin}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Berakhir</label>
//             <p className="mt-1 text-gray-900 dark:text-white">{karyawan.tanggalBerakhir || '-'}</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
//             <p className="mt-1">
//               <span
//                 className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
//                   karyawan.status === 'aktif'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 {karyawan.status || '-'}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Close Button */}
//         <div className="mt-8 flex justify-end gap-3">
//           <Button onClick={onClose} variant="outline">
//             Tutup
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
