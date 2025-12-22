import { DataTable, DataTableColumn } from '../../../../../components/shared/datatable/DataTable';
import { PengunduranDiri } from '../../../types/Resignation';
import Button from '../../../../../components/ui/button/Button';
import { ChevronDown } from 'react-feather';
import { Dropdown } from '../../../../../components/ui/dropdown/Dropdown';
import { useReviewed } from '../../../hooks/resignation/useReviewed';

export default function TabReviewed() {
  const {
    data,
    loading,
    error,
    page,
    limit,
    isStatusDropdownOpen,
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    toggleStatusDropdown,
    closeStatusDropdown,
    handleNavigateToView,
  } = useReviewed();

  // Define columns untuk DataTable
  const columns: DataTableColumn<PengunduranDiri>[] = [
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
      label: 'NIP',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'name',
      label: 'Pengguna',
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
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      minWidth: 130,
      sortable: true,
    },
    {
      id: 'tanggalEfektif',
      label: 'Tanggal Efektif',
      minWidth: 130,
      sortable: true,
      format: (value) => value || '-',
    },
    {
      id: 'department',
      label: 'Departemen',
      minWidth: 150,
      sortable: true,
    },
    {
      id: 'alasan',
      label: 'Alasan',
      minWidth: 200,
      sortable: false,
      format: (value) => (
        <span className="line-clamp-2 text-sm text-gray-600">
          {value}
        </span>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      align: 'center',
      sortable: true,
      format: (value) => (
        <span
          className={`status-styling rounded-full px-3 py-1 text-sm font-medium ${
            value === 'Disetujui'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>Error: {error}</p>
        <Button onClick={() => fetchPengunduranDiri()} variant="primary" size="sm" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <DataTable
        title="Pengunduran Diri"
        data={data}
        columns={columns}
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={limit}
        pageSizeOptions={[5, 10, 25, 50]}
        filterable={true}
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => toggleStatusDropdown()}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Selesai
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isStatusDropdownOpen} onClose={() => closeStatusDropdown()}>
              <div className="p-2 w-40">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    handleNavigateToView('pending');
                  }}
                >
                  Ditinjau
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    handleNavigateToView('reviewed');
                  }}
                >
                  Selesai
                </button>
              </div>
            </Dropdown>
          </div>
        }
        loading={loading}
        emptyMessage="Tidak ada data pengunduran diri yang sudah di-review"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
      />
    </div>
  );
}
