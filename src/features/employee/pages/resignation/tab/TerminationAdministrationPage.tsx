import { useMemo, useState, useEffect } from 'react';
import { DataTable, DataTableColumn, DataTableAction } from '../../../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil } from '@/icons/components/icons';
import { useNavigate } from 'react-router-dom';
import AddUserTermination, { AddTerminationForm } from '@/features/employee/components/modals/termination/AddUserTermination';
import { useApiResignation } from '@/features/employee/hooks/api/useApiResignation';
import { formatDateToIndonesian } from '@/utils/formatDate';

type TerminationItem = {
  id: string;
  termination_id: string;
  nip: string;
  name: string;
  tanggalPengajuan: string;
  tanggalEfektif: string;
  posisi: string;
  catatan: string;
  statusBerakhir: string;
  statusTerminasi: 'Selesai' | 'Sedang diproses';
};

export default function TerminationAdministrationPage() {
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {
    loading,
    error,
    adminList,
    adminPagination,
    fetchAdministrationIndex,
    storeAdministration,
  } = useApiResignation();

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    fetchAdministrationIndex({
      page: adminPagination.currentPage,
      per_page: adminPagination.perPage,
    });
  }, [adminPagination.currentPage, adminPagination.perPage]);

  // Transform API data to table format
  const data: TerminationItem[] = useMemo(
    () =>
      adminList.map((item, idx) => ({
        id: item.id || `${item.NIP}-${idx}`,
        nip: item.NIP || '',
        name: item.employee_name || '',
        tanggalPengajuan: item.tanggal_pengajuan_terminasi || '',
        tanggalEfektif: item.tanggal_efektif_terminasi || '',
        posisi: item.position_name || '',
        catatan: item.description || '-',
        statusBerakhir: item.end_status || '-',
        statusTerminasi: (item.status_terminasi === 'Selesai' ? 'Selesai' : 'Sedang diproses') as 'Selesai' | 'Sedang diproses',
        termination_id: item.termination_id || '',
      })),
    [adminList]
  );

  const actions: DataTableAction<TerminationItem>[] = [
    {
      icon: <IconFileDetail />,
      onClick: (row) => navigate(`/resignation/termination-administration/${row.termination_id}`),
      condition: (row) => row.statusTerminasi === 'Selesai',
    },
    {
      icon: <IconPencil />,
      onClick: (row) => navigate(`/resignation/termination-administration/${row.termination_id}`),
      color: 'warning',
      condition: (row) => row.statusTerminasi === 'Sedang diproses',
    },
  ];

  const columns: DataTableColumn<TerminationItem>[] = useMemo(
    () => [
      {
        id: 'no',
        label: 'No.',
        minWidth: 50,
        align: 'center',
        sortable: false,
        format: (_, row) => data.indexOf(row) + 1 + (adminPagination.currentPage - 1) * adminPagination.perPage,
      },
      { id: 'nip', label: 'NIP', minWidth: 100, sortable: true },
      { id: 'name', label: 'Pengguna', minWidth: 160, sortable: true },
      { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan', minWidth: 140, sortable: true, dateRangeFilter: true, format: (v) => formatDateToIndonesian(v) || v },
      { id: 'tanggalEfektif', label: 'Tanggal Efektif', minWidth: 140, sortable: true, dateRangeFilter: true, format: (v) => formatDateToIndonesian(v) || v },
      { id: 'posisi', label: 'Posisi', minWidth: 180, sortable: true },
      {
        id: 'catatan',
        label: 'Catatan',
        minWidth: 180,
        sortable: false,
        format: (v) => <span className="text-sm text-gray-600">{v}</span>,
      },
      { id: 'statusBerakhir', label: 'Status Berakhir', minWidth: 160, sortable: true },
      {
        id: 'statusTerminasi',
        label: 'Status Terminasi',
        minWidth: 160,
        sortable: true,
        filterOptions: [
          { label: 'Selesai', value: 'Selesai' },
          { label: 'Sedang diproses', value: 'Sedang diproses' },
        ],
        format: (value) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              value === 'Selesai' ? 'bg-green-100 text-green-700 status-styling' : 'bg-yellow-100 text-yellow-800 status-styling'
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
    [data, adminPagination]
  );

  const handleAddSubmit = async (payload: AddTerminationForm) => {
    // console.log('Submitting termination administration:', payload);
    // return
    const storePayload = {
      employee_id: payload.nip,
      tanggal_pengajuan_terminasi: payload.tanggalPengajuan || '',
      tanggal_efektif_terminasi: payload.tanggalEfektif || '',
      description: payload.catatan || '',
      document: payload.file as File,
      end_status_id: payload.statusBerakhir,
    };
    const success = await storeAdministration(storePayload);
    if (success) {
      setIsAddOpen(false);
      await fetchAdministrationIndex({
        page: adminPagination.currentPage,
        per_page: adminPagination.perPage,
      });
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        title="Terminasi Administrasi"
        data={data}
        columns={columns}
        actions={actions}
        searchable
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={adminPagination.perPage}
        pageSizeOptions={[5, 10, 25, 50]}
        filterable
        addButtonLabel="Tambah Terminasi"
        onAdd={() => setIsAddOpen(true)}
        loading={loading}
        onPageChangeExternal={(p) => {
          // Update pagination and fetch
          const newPage = p;
          fetchAdministrationIndex({
            page: newPage,
            per_page: adminPagination.perPage,
          });
        }}
        onRowsPerPageChangeExternal={(n) => {
          // Update pagination and fetch
          fetchAdministrationIndex({
            page: 1,
            per_page: n,
          });
        }}
      />
      <AddUserTermination
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        submitting={loading}
      />
    </div>
  );
}
