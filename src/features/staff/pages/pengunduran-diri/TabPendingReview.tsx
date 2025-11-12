import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../../features/structure-and-organize/components/datatable/DataTable';
import { PengunduranDiri } from '../../types/PengunduranDiri';
import usePengunduranDiri from '../../hooks/usePengunduranDiri';
import { Edit2} from 'react-feather';
import Button from '../../../../components/ui/button/Button';

export default function TabPendingReview() {
  const navigate = useNavigate();
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
    approvePengunduranDiri,
    rejectPengunduranDiri,
  } = usePengunduranDiri({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
    status: 'In Progress' as const,
  });

  const [selectedItem, setSelectedItem] = useState<PengunduranDiri | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [tanggalEfektif, setTanggalEfektif] = useState('');

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
      label: 'Edit',
      icon: <Edit2 size={16} />,
      onClick: (row) => {
        navigate(`/pengunduran-diri/${row.id}`);
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

  const confirmApprove = async () => {
    if (!selectedItem || !tanggalEfektif) return;
    
    try {
      await approvePengunduranDiri(selectedItem.id, tanggalEfektif);
      setShowApproveModal(false);
      setTanggalEfektif('');
      setSelectedItem(null);
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  const confirmReject = async () => {
    if (!selectedItem) return;
    
    try {
      await rejectPengunduranDiri(selectedItem.id);
      setShowRejectModal(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error rejecting:', err);
    }
  };

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
        data={data}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={limit}
        pageSizeOptions={[5, 10, 25, 50]}
        filterable={true}
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
                  setShowApproveModal(false);
                  setTanggalEfektif('');
                  setSelectedItem(null);
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
                  setShowRejectModal(false);
                  setSelectedItem(null);
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
