

import { DataTable, DataTableColumn, DataTableAction } from '../../../../structure-and-organize/components/datatable/DataTable';
import { Eye } from 'react-feather';
import Tabs from '../../../../structure-and-organize/components/Tabs';
import { useLocation } from 'react-router-dom';

type KontrakRow = {
  idKaryawan: string;
  name: string;
  department: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  sisaKontrak: string;
  avatar?: string;
};

const sampleData: KontrakRow[] = [
  { idKaryawan: '12345678910', name: 'Lindsey Curtis', department: 'Direktur Teknologi dan Jaringan', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 bulan' },
  { idKaryawan: '12345678910', name: 'Dedik Mulyadi', department: 'Manajer Teknologi dan Jaringan', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 bulan' },
  { idKaryawan: '12345678910', name: 'Onana', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 bulan' },
  { idKaryawan: '12345678910', name: 'Maguire', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '1 bulan' },
  { idKaryawan: '12345678910', name: 'Mulyadi', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '1 bulan' },
  { idKaryawan: '12345678910', name: 'Lindsey Curtis', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '1 bulan' },
  { idKaryawan: '12345678910', name: 'Kaiya Curtis', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '1 bulan' },
  { idKaryawan: '12345678910', name: 'Carla George', department: 'Accounting', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 Minggu' },
  { idKaryawan: '12345678910', name: 'Abram Schleifer', department: 'Fullstack Developer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 Minggu' },
  { idKaryawan: '12345678910', name: 'Rain Schleifer', department: 'Digital Marketer', tanggalMulai: '01 Jan, 2024', tanggalBerakhir: '12 Mar, 2025', sisaKontrak: '2 Minggu' },
];

export default function PerpanjanganKontrak() {
  const location = useLocation();
  const tabs = [
    { id: 'data-karyawan', label: 'Data Master Karyawan', link: '/data-karyawan' },
    { id: 'perpanjangan-kontrak', label: 'Perpanjangan Kontrak', link: '/perpanjangan-kontrak' },
  ];
  const activeTab = location.pathname.includes('perpanjangan-kontrak') ? 'perpanjangan-kontrak' : 'data-karyawan';

  const columns: DataTableColumn<KontrakRow>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
      format: (_, row) => sampleData.indexOf(row) + 1,
    },
    { id: 'idKaryawan', label: 'ID Karyawan', minWidth: 120, sortable: true },
    {
      id: 'name',
      label: 'User',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`}
            alt={value}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <div className="text-sm font-medium">{value}</div>
            <div className="text-[11px] text-gray-500">Web Designer</div>
          </div>
        </div>
      ),
    },
    { id: 'department', label: 'Departemen', minWidth: 180, sortable: true },
    { id: 'tanggalMulai', label: 'Tanggal Mulai', minWidth: 140, sortable: true },
    { id: 'tanggalBerakhir', label: 'Tanggal Berakhir', minWidth: 150, sortable: true },
    { id: 'sisaKontrak', label: 'Sisa Kontrak', minWidth: 120, sortable: true },
  ];

  const actions: DataTableAction<KontrakRow>[] = [
    {
      label: '',
      icon: <Eye size={16} />,
      onClick: (row) => {
        console.log('Lihat detail kontrak:', row);
      },
      variant: 'outline',
      color: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} className={'justify-start mb-2'} />
      <DataTable
        data={sampleData}
        columns={columns}
        actions={actions}
        title="Perpanjangan Kontrak"
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        filterable={true}
        loading={false}
        emptyMessage="Tidak ada data kontrak"
      />
    </div>
  );
}