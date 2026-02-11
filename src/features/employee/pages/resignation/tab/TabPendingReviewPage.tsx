import { DataTable, DataTableColumn, DataTableAction } from '../../../../../components/shared/datatable/DataTable';
import { ResignationApplicationListItem } from '../../../types/dto/ResignationType';
import { IconForm, IconPencil } from '@/icons/components/icons';
import Button from '../../../../../components/ui/button/Button';
import { useEffect, useState } from 'react';
import { useApiResignation } from '../../../hooks/api/useApiResignation';
import {  useNavigate } from 'react-router';
import { formatDateToIndonesian } from '@/utils/formatDate';

export default function TabPendingReview() {
  const {
    applications,
    loading,
    error,
    fetchApplications,
  } = useApiResignation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchApplications({ page, per_page: limit, search });
  }, [page, limit, search]);

  // Define columns untuk DataTable
  const columns: DataTableColumn<ResignationApplicationListItem>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
      format: (_, row) => {
        const index = applications.indexOf(row as any) + 1 + (page - 1) * limit;
        return index;
      },
    },
    {
      id: 'employee_id',
      label: 'NIP',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'full_name',
      label: 'Pengguna',
      minWidth: 150,
      sortable: true,
    },
    {
      id: 'tanggal_pengajuan',
      label: 'Tanggal Pengajuan',
      minWidth: 130,
      sortable: true,
      format: (value) => formatDateToIndonesian(String(value)),
    },
    {
      id: 'efektif_resign_date',
      label: 'Tanggal Efektif',
      minWidth: 130,
      sortable: false,
      format: (value) => <span>{value ? formatDateToIndonesian(String(value)) : '-'}</span>,
    },
    {
      id: 'position_name',
      label: 'Posisi',
      minWidth: 160,
      sortable: false,
    },
    {
      id: 'note_hr',
      label: 'Catatan',
      minWidth: 220,
      sortable: false,
      format: (value) => (
        <span className="line-clamp-2 text-sm text-gray-600">
          {value}
        </span>
      ),
    },
    {
      id: 'status_name',
      label: 'Status Pengunduran diri',
      minWidth: 130,
      sortable: true,
      format: (value) => {
        const val = value ?? '-';
        const statusColors: Record<string, string> = {
          'In Progress': 'bg-blue-100 text-blue-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Dalam peninjauan': 'bg-yellow-100 text-yellow-800',
          'Menunggu Diproses': 'bg-yellow-100 text-yellow-800',
          'Disetujui': 'bg-green-100 text-green-800',
          'Ditolak': 'bg-red-100 text-red-800',
        };
        return (
          <span className={`status-styling rounded-full text-xs font-medium ${statusColors[val] || 'bg-gray-100 text-gray-800'}`}>
            {val}
          </span>
        );
      },
    },
  ];

  // Define actions untuk DataTable
  const actions: DataTableAction<ResignationApplicationListItem>[] = [
    {
      icon: <IconPencil />,
      onClick: (row) => {

        navigate(`/resignation/${(row as any).application_id}`);
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
        <Button onClick={() => fetchApplications({ page, per_page: limit, search })} variant="primary" size="sm" className="mt-2">
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
        data={applications as any}
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
        // toolbarRightSlot={
        //   <div className="relative">
        //     <Button
        //       onClick={() => toggleStatusDropdown()}
        //       variant="outline"
        //       size="sm"
        //       className="flex items-center gap-1 dropdown-toggle"
        //     >
        //       Ditinjau
        //       <ChevronDown size={16} />
        //     </Button>
        //     <Dropdown isOpen={isStatusDropdownOpen} onClose={() => closeStatusDropdown()}>
        //       <div className="p-2 w-40">
        //         <button
        //           className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
        //           onClick={() => {
        //             handleNavigateToView('pending');
        //           }}
        //         >
        //           Ditinjau
        //         </button>
        //         <button
        //           className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
        //           onClick={() => {
        //             handleNavigateToView('reviewed');
        //           }}
        //         >
        //           Selesai
        //         </button>
        //       </div>
        //     </Dropdown>
        //   </div>
        // }
        loading={loading}
        emptyMessage="Tidak ada pengajuan pengunduran diri"
        onSearchChange={(val) => setSearch(val)}
        onSortChange={() => {}}
        onPageChangeExternal={(p) => setPage(p)}
        onRowsPerPageChangeExternal={(l) => setLimit(l)}
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

      {/* Approve/Reject modals di halaman ini tidak digunakan pada integrasi API baru */}
    </div>
  );
}
