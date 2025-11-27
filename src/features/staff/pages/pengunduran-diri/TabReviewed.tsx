import { useState } from 'react';
import { DataTable, DataTableColumn } from '../../../../features/structure-and-organize/components/datatable/DataTable';
import { PengunduranDiri } from '../../types/PengunduranDiri';
import usePengunduranDiri from '../../hooks/usePengunduranDiri';
import Button from '../../../../components/ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { Dropdown } from '../../../../components/ui/dropdown/Dropdown';

export default function TabReviewed() {
  const navigate = useNavigate();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const {
    data,
    loading,
    error,
    page,
    limit,
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePengunduranDiri({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
    status: 'Approved' as const,
  });

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
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Selesai
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isStatusDropdownOpen} onClose={() => setIsStatusDropdownOpen(false)}>
              <div className="p-2 w-40">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setIsStatusDropdownOpen(false);
                    navigate('/pengunduran-diri?view=pending');
                  }}
                >
                  Ditinjau
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setIsStatusDropdownOpen(false);
                    navigate('/pengunduran-diri?view=reviewed');
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
