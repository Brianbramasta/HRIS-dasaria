import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../../structure-and-organize/components/datatable/DataTable';
import {  FileText, ChevronDown } from 'react-feather';
import { IconPencil as Edit } from '@/icons/components/icons';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';

type KontrakRow = {
  idKaryawan: string;
  name: string;
  department: string;
  tanggalMasuk: string;
  tanggalBerakhir: string;
  sisaKontrak: string;
  statusPerpanjangan: string;
  statusAtasan: string;
  detailKontrakPengajuan: string;
  tanggalNegoisasi: string;
  catatan: string;
  statusKaryawan: string;
  avatar?: string;
  position?: string;
};

const sampleData: KontrakRow[] = [
  { 
    idKaryawan: '12345678910', 
    name: 'Lindsey Curtis', 
    position: 'Web Designer',
    department: 'Direktur Teknologi dan Jaringan', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    statusPerpanjangan: 'Diperpanjang',
    statusAtasan: 'Disetujui',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Disetujui'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Dedik Mulyadi',
    position: 'Data Analyst', 
    department: 'Manajer Teknologi dan Jaringan', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    statusPerpanjangan: 'Ditolak',
    statusAtasan: 'Ditolak',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: 'Kurang Perfom',
    statusKaryawan: 'Info'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Onana',
    position: 'UI/UX Designer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    statusPerpanjangan: 'Menunggu Jadwal Negoisasi',
    statusAtasan: 'Disetujui',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Negoisasi'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Maguire',
    position: 'Project Manager', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    statusPerpanjangan: 'Negoisasi',
    statusAtasan: 'Disetujui',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '12 Mar, 2025',
    catatan: '-',
    statusKaryawan: 'Negoisasi'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Mulyadi',
    position: 'Front-end Developer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    statusPerpanjangan: 'Pending',
    statusAtasan: 'Pending',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Pending'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Lindsey Curtis',
    position: 'Back-end Developer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    statusPerpanjangan: 'Pending',
    statusAtasan: 'Pending',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Pending'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Kaiya Curtis',
    position: 'Human Resource', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    statusPerpanjangan: 'Ditolak',
    statusAtasan: 'Disetujui',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Ditolak'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Carla George',
    position: 'Accounting', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    statusPerpanjangan: 'Ditolak',
    statusAtasan: 'Disetujui',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Ditolak'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Abram Schleifer',
    position: 'Accounting', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    statusPerpanjangan: 'Ditolak',
    statusAtasan: 'Ditolak',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Info'
  },
  { 
    idKaryawan: '12345678910', 
    name: 'Rain Schleifer',
    position: 'Digital Marketer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    statusPerpanjangan: 'Ditolak',
    statusAtasan: 'Ditolak',
    detailKontrakPengajuan: '-',
    tanggalNegoisasi: '-',
    catatan: '-',
    statusKaryawan: 'Info'
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'disetujui':
    case 'diperpanjang':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'ditolak':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'negoisasi':
    case 'menunggu jadwal negoisasi':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default function PerpanjanganKontrak() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const columns: DataTableColumn<KontrakRow>[] = [
    {
      id: 'no',
      label: 'No.',
      minWidth: 50,
      align: 'center',
      sortable: false,
    },
    { id: 'idKaryawan', label: 'ID Karyawan', minWidth: 120, sortable: true },
    {
      id: 'name',
      label: 'Pengguna',
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
            <div className="text-[11px] text-gray-500">{row.position || 'Employee'}</div>
          </div>
        </div>
      ),
    },
    { id: 'department', label: 'Departemen', minWidth: 180, sortable: true },
    { id: 'tanggalMasuk', label: 'Tanggal Masuk', minWidth: 140, sortable: true },
    { id: 'tanggalBerakhir', label: 'Tanggal Berakhir', minWidth: 150, sortable: true },
    { id: 'sisaKontrak', label: 'Sisa Kontrak', minWidth: 120, sortable: true },
    {
      id: 'statusPerpanjangan',
      label: 'Status Perpanjangan',
      minWidth: 180,
      sortable: true,
      format: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      id: 'statusAtasan',
      label: 'Status Atasan',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    { 
      id: 'detailKontrakPengajuan', 
      label: 'Detail Kontrak Pengajuan', 
      minWidth: 180, 
      sortable: false,
      align: 'center',
      format: (value) => value === '-' ? value : (
        <FileText size={16} className="inline text-gray-500" />
      ),
    },
    { id: 'tanggalNegoisasi', label: 'Tanggal Negoisasi', minWidth: 160, sortable: true },
    { id: 'catatan', label: 'Catatan', minWidth: 150, sortable: false },
    {
      id: 'statusKaryawan',
      label: 'Status Karyawan',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<KontrakRow>[] = [
    {
      label: '',
      icon: <Edit />,
      onClick: (row) => {
        navigate(`/perpanjangan-kontrak/detail/${row.idKaryawan}`);
      },
      variant: 'outline',
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        data={sampleData}
        columns={columns}
        actions={actions}
        title="Perpanjangan Kontrak"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        filterable={true}
        loading={false}
        emptyMessage="Tidak ada data kontrak"
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Pengajuan & Kelola Kontrak
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/perpanjangan-kontrak');
                  }}
                >
                  Pengajuan & Kelola Kontrak
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/perpanjangan-kontrak/persetujuan');
                  }}
                >
                  Persetujuan Perpanjangan Kontrak
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />
    </div>
  );
}