import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { X, Check, FileText, ChevronDown } from 'react-feather';
import Checkbox from '@/components/form/input/Checkbox';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';

type PersetujuanKontrakRow = {
  id: string;
  idKaryawan: string;
  name: string;
  department: string;
  tanggalMasuk: string;
  tanggalBerakhir: string;
  sisaKontrak: string;
  status: string;
  detailPerpanjangan: string;
  catatan: string;
  avatar?: string;
  position?: string;
};

const sampleData: PersetujuanKontrakRow[] = [
  { 
    id: '1',
    idKaryawan: '12345678910', 
    name: 'Lindsey Curtis', 
    position: 'Web Designer',
    department: 'Direktur Teknologi dan Jaringan', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    status: 'Diperpanjang',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '2',
    idKaryawan: '12345678910', 
    name: 'Dedik Mulyadi',
    position: 'Data Analyst', 
    department: 'Manajer Teknologi dan Jaringan', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    status: 'Ditolak',
    detailPerpanjangan: '-',
    catatan: 'Kurang Perfom',
  },
  { 
    id: '3',
    idKaryawan: '12345678910', 
    name: 'Onana',
    position: 'UI/UX Designer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 bulan',
    status: 'Diperpanjang',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '4',
    idKaryawan: '12345678910', 
    name: 'Maguire',
    position: 'Project Manager', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    status: 'Diperpanjang',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '5',
    idKaryawan: '12345678910', 
    name: 'Mulyadi',
    position: 'Front-end Developer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    status: 'Pending',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '6',
    idKaryawan: '12345678910', 
    name: 'Lindsey Curtis',
    position: 'Back-end Developer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    status: 'Pending',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '7',
    idKaryawan: '12345678910', 
    name: 'Kaiya Curtis',
    position: 'Human Resource', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '1 bulan',
    status: 'Ditolak',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '8',
    idKaryawan: '12345678910', 
    name: 'Carla George',
    position: 'Accounting', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    status: 'Ditolak',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '9',
    idKaryawan: '12345678910', 
    name: 'Abram Schleifer',
    position: 'Accounting', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    status: 'Ditolak',
    detailPerpanjangan: '-',
    catatan: '-',
  },
  { 
    id: '10',
    idKaryawan: '12345678910', 
    name: 'Rain Schleifer',
    position: 'Digital Marketer', 
    department: 'Fullstack Developer', 
    tanggalMasuk: '01 Jan, 2024', 
    tanggalBerakhir: '12 Mar, 2025', 
    sisaKontrak: '2 Minggu',
    status: 'Ditolak',
    detailPerpanjangan: '-',
    catatan: '-',
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
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default function PersetujuanPerpanjanganKontrak() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? sampleData.map((row) => row.id) : []);
  };

  const handleApprove = () => {
    if (selectedRows.length === 0) return;
    console.log('Approve rows:', selectedRows);
    // Add your approval logic here
    setSelectedRows([]);
  };

  const handleReject = () => {
    if (selectedRows.length === 0) return;
    console.log('Reject rows:', selectedRows);
    // Add your rejection logic here
    setSelectedRows([]);
  };

  const columns: DataTableColumn<PersetujuanKontrakRow>[] = [
    {
      id: 'checkbox',
      label: '',
      minWidth: 50,
      align: 'center',
      sortable: false,
      headerFormat: () => (
        <Checkbox
          checked={selectedRows.length === sampleData.length && sampleData.length > 0}
          onChange={handleSelectAll}
        />
      ),
      format: (_, row) => (
        <Checkbox
          checked={selectedRows.includes(row.id)}
          onChange={(checked) => handleCheckboxChange(row.id, checked)}
        />
      ),
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
      id: 'status',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    { 
      id: 'detailPerpanjangan', 
      label: 'Detail Perpanjangan', 
      minWidth: 160, 
      sortable: false,
      align: 'center',
      format: (value) => value === '-' ? value : (
        <FileText size={16} className="inline text-gray-500" />
      ),
    },
    { id: 'catatan', label: 'Catatan', minWidth: 150, sortable: false },
  ];

  const actions: DataTableAction<PersetujuanKontrakRow>[] = [
    {
      label: '',
      icon: <X size={16} className="text-red-600" />,
      onClick: (row) => {
        console.log('Reject:', row);
      },
      variant: 'outline',
      className: 'border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20',
    },
    {
      label: '',
      icon: <Check size={16} className="text-green-600" />,
      onClick: (row) => {
        console.log('Approve:', row);
      },
      variant: 'outline',
      className: 'border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        data={sampleData}
        columns={columns}
        actions={actions}
        title="Persetujuan Perpanjangan Kontrak"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        filterable={true}
        loading={false}
        emptyMessage="Tidak ada data kontrak"
        toolbarRightSlotAtas={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={selectedRows.length === 0}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ditolak
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              disabled={selectedRows.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disetujui
            </Button>
          </div>
        }
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Persetujuan Perpanjangan Kontrak
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
