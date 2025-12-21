import { DataTable, DataTableColumn, DataTableAction } from '../../../../structure-and-organize/components/datatable/DataTable';
import { PengunduranDiri } from '../../../types/Resignation';
import { ChevronDown } from 'react-feather';
import { IconForm, IconPencil } from '@/icons/components/icons';
import Button from '../../../../../components/ui/button/Button';
import { Dropdown } from '../../../../../components/ui/dropdown/Dropdown';
import { usePendingReview } from '../../../hooks/resignation/usePendingReview';

export default function TabPendingReview({ onOpenForm }: { onOpenForm?: () => void }) {
  const {
    data,
    loading,
    error,
    page,
    limit,
    selectedItem,
    showApproveModal,
    showRejectModal,
    tanggalEfektif,
    isStatusDropdownOpen,
    setTanggalEfektif,
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleNavigateToDetail,
    handleCloseApproveModal,
    handleCloseRejectModal,
    confirmApprove,
    confirmReject,
    toggleStatusDropdown,
    closeStatusDropdown,
    handleNavigateToView,
  } = usePendingReview();

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
      sortable: true,
      format: (value) => {
        const statusColors: Record<string, string> = {
          'In Progress': 'bg-blue-100 text-blue-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      },
    },
  ];

  // Define actions untuk DataTable
  const actions: DataTableAction<PengunduranDiri>[] = [
    {
      icon: <IconPencil />,
      onClick: (row) => {
        handleNavigateToDetail(row.id);
      },
      variant: 'outline',
      color: 'warning',
    },
  ];

//   const handleApprove = (row: PengunduranDiri) => {
//     setSelectedItem(row);
//     setShowApproveModal(true);
//   };

//   const handleReject = (row: PengunduranDiri) => {
//     setSelectedItem(row);
//     setShowRejectModal(true);
//   };

  // Unused functions - moved to hook

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
        actions={actions}
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={limit}
        pageSizeOptions={[5, 10, 25, 50]}
        filterable={true}
        // comment dulu - revisi ui
        // onAdd={onOpenForm}
        // addButtonLabel="Form Pengunduran Diri"
        addButtonIcon={<IconForm />}
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => toggleStatusDropdown()}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Ditinjau
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
        emptyMessage="Tidak ada data pengunduran diri yang pending"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
      />

      {/* Action Column - Render approve/reject buttons */}
      {/* {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full">
            <thead className="bg-[#004969] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(item)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700"
                      >
                        <Check size={16} />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(item)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}

      {/* Approve Modal */}
      {showApproveModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Approve Pengunduran Diri</h3>
            
            <div className="mb-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nama: <span className="font-semibold text-gray-900 dark:text-white">{selectedItem.name}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alasan: <span className="font-semibold text-gray-900 dark:text-white">{selectedItem.alasan}</span>
              </p>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tanggal Efektif <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalEfektif}
                  onChange={(e) => setTanggalEfektif(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  handleCloseApproveModal();
                }}
                variant="outline"
              >
                Batal
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={!tanggalEfektif}
                className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Reject Pengunduran Diri</h3>
            
            <div className="mb-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin me-reject pengunduran diri <span className="font-semibold text-gray-900 dark:text-white">{selectedItem.name}</span>?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  handleCloseRejectModal();
                }}
                variant="outline"
              >
                Batal
              </Button>
              <Button
                onClick={confirmReject}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
