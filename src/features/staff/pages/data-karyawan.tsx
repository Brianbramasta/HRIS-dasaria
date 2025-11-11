

import { useState } from 'react';
import { DataTable, DataTableColumn } from '../../../features/structure-and-organize/components/datatable/DataTable';
import { Karyawan } from '../types/Karyawan';
import useKaryawan from '../hooks/useKaryawan';
// import { Edit2, Trash2, Eye } from 'react-feather';
import Button from '../../../components/ui/button/Button';

export default function DataKaryawanPage() {
  const {
    data,
    loading,
    error,
    page,
    limit,
    fetchKaryawan,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    exportKaryawan,
  } = useKaryawan({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
  });

  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Define columns untuk DataTable
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
      id: 'idKaryawan',
      label: 'ID Karyawan',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'name',
      label: 'User',
      minWidth: 150,
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
            alt={value}
            className="h-8 w-8 rounded-full"
          />
          <span>{value}</span>
        </div>
      ),
    },
    {
      id: 'jabatan',
      label: 'Jabatan',
      minWidth: 130,
      sortable: true,
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
      id: 'tanggalJoin',
      label: 'Tanggal Join',
      minWidth: 130,
      sortable: true,
    },
    {
      id: 'tanggalBerakhir',
      label: 'Tanggal Berakhir',
      minWidth: 140,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'company',
      label: 'Company',
      minWidth: 130,
      sortable: true,
      format: (value) => (
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          {value}
        </span>
      ),
    },
  ];

  // Define actions untuk DataTable
  // const actions: DataTableAction<Karyawan>[] = [
  //   {
  //     label: 'Lihat Detail',
  //     icon: <Eye size={16} />,
  //     onClick: (row) => {
  //       setSelectedKaryawan(row);
  //       setShowDetailModal(true);
  //     },
  //     variant: 'outline',
  //     color: 'info',
  //   },
  //   {
  //     label: 'Edit',
  //     icon: <Edit2 size={16} />,
  //     onClick: (row) => {
  //       console.log('Edit karyawan:', row);
  //       // TODO: Navigate to edit page or open edit modal
  //     },
  //     variant: 'outline',
  //     color: 'warning',
  //   },
  //   {
  //     label: 'Hapus',
  //     icon: <Trash2 size={16} />,
  //     onClick: (row) => {
  //       console.log('Delete karyawan:', row);
  //       // TODO: Show delete confirmation modal
  //     },
  //     variant: 'outline',
  //     color: 'error',
  //   },
  // ];

  const handleAddKaryawan = () => {
    console.log('Add new karyawan');
    // TODO: Navigate to add page or open add modal
  };

  const handleExportKaryawan = async () => {
    try {
      await exportKaryawan('csv');
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>Error: {error}</p>
        <Button onClick={() => fetchKaryawan()} variant="primary" size="sm" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Master Karyawan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola data karyawan perusahaan
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={data}
        columns={columns}
        // actions={actions}
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
      />

      {/* Detail Modal */}
      {showDetailModal && selectedKaryawan && (
        <DetailKaryawanModal
          karyawan={selectedKaryawan}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedKaryawan(null);
          }}
        />
      )}
    </div>
  );
}

// Simple Detail Modal Component
function DetailKaryawanModal({
  karyawan,
  isOpen,
  onClose,
}: {
  karyawan: Karyawan;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Detail Karyawan</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Avatar */}
          <div className="col-span-2 flex justify-center">
            <img
              src={karyawan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${karyawan.name}`}
              alt={karyawan.name}
              className="h-32 w-32 rounded-full"
            />
          </div>

          {/* Information Grid */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Karyawan</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.idKaryawan}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Posisi</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.posisi}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jabatan</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.jabatan}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Perusahaan</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.company}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Departemen</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.department || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kantor</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.office || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Join</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.tanggalJoin}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Berakhir</label>
            <p className="mt-1 text-gray-900 dark:text-white">{karyawan.tanggalBerakhir || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <p className="mt-1">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  karyawan.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {karyawan.status || '-'}
              </span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}