import { DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { Karyawan } from '../../types/Employee';
import { IconFileDetail, IconHapus } from '@/icons/components/icons';
import { renderSisaKontrakBadge } from './DateHelpers';
import { formatDateToIndonesian } from '@/utils/formatDate';

/**
 * Get columns configuration for employee data table
 */
export const getKaryawanColumns = (
  data: Karyawan[],
  page: number,
  limit: number,
  navigate: (path: string) => void
): DataTableColumn<Karyawan>[] => [
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
    format: (_, row) => formatDateToIndonesian(row.birth_date as string) || '-',
  },
  {
    id: 'tanggalJoin',
    label: 'Tanggal Masuk',
    minWidth: 130,
    sortable: true,
    format: (_, row) => formatDateToIndonesian(row.tanggalJoin as string) || '-',
  },
  {
    id: 'tanggalBerakhir',
    label: 'Tanggal Berakhir',
    minWidth: 140,
    sortable: true,
    format: (value) => formatDateToIndonesian(value as string) || '-',
  },
  {
    id: 'sisaKontrak',
    label: 'Sisa Kontrak',
    minWidth: 130,
    sortable: false,
    format: (_, row) => renderSisaKontrakBadge(row.tanggalBerakhir),
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
    id: 'jabatan',
    label: 'Jabatan',
    minWidth: 130,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'jenjangJabatan',
    label: 'Jenjang Jabatan',
    minWidth: 140,
    sortable: true,
    format: (_, row) => row.jenjangJabatan || row.position_level || '-',
  },
  {
    id: 'grade',
    label: 'Golongan',
    minWidth: 100,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'posisi',
    label: 'Posisi',
    minWidth: 130,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'departement',
    label: 'Departemen',
    minWidth: 130,
    sortable: true,
    format: (_, row) => row.departement || row.department || '-',
  },
  {
    id: 'divisi',
    label: 'Divisi',
    minWidth: 130,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'direktorat',
    label: 'Direktorat',
    minWidth: 130,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'employment_status',
    label: 'Status Karyawan',
    minWidth: 130,
    sortable: true,
    format: (value) => (
      <span className={`inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${
        value === 'active' || value === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value || '-'}
      </span>
    ),
  },
  {
    id: 'payroll_status',
    label: 'Status Payroll',
    minWidth: 120,
    sortable: true,
    format: (value) => (
      <span className={`inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${
        value === 'active' || value === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value || '-'}
      </span>
    ),
  },
  {
    id: 'statusDataKaryawan',
    label: 'Status Data Karyawan',
    minWidth: 150,
    sortable: true,
    format: (_, row) => {
      const status = row.employee_data_status || '-';
      return (
        <span className={`inline-block rounded-full p-[10px] w-full text-center  text-xs font-medium ${
          status === 'complete' || status === 'lengkap' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status || 'Lengkap'}
        </span>
      );
    },
  },
  {
    id: 'employee_category',
    label: 'Kategori Karyawan',
    minWidth: 140,
    sortable: true,
    format: (value) => value || '-',
  },
  {
    id: 'posisiAccess',
    label: 'Hak Akses',
    minWidth: 120,
    sortable: true,
    format: (_, row) => row.posisiAccess || row.user_access || '-',
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

/**
 * Get actions configuration for employee data table
 */
export const getKaryawanActions = (
  onDelete: (row: Karyawan) => void
): DataTableAction<Karyawan>[] => [
  {
    icon: <IconHapus />,
    onClick: onDelete,
    variant: 'outline',
    color: 'error',
  },
];
