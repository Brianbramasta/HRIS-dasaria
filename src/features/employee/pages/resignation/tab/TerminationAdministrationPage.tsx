import { useMemo, useState } from 'react';
import { DataTable, DataTableColumn, DataTableAction } from '../../../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil } from '@/icons/components/icons';
import { useNavigate } from 'react-router-dom';

type TerminationItem = {
  id: string;
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const data: TerminationItem[] = useMemo(
    () => [
      {
        id: '1',
        nip: 'DSR999',
        name: 'Lindsey Curtis',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Direktur Teknologi dan Jaringan',
        catatan: 'Pengajuan Mendadak',
        statusBerakhir: 'PHK',
        statusTerminasi: 'Selesai',
      },
      {
        id: '2',
        nip: 'DSR999',
        name: 'Bedi Mulyaod',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Manajer Teknologi dan Jaringan',
        catatan: '-',
        statusBerakhir: 'Kontrak Selesai',
        statusTerminasi: 'Selesai',
      },
      {
        id: '3',
        nip: 'DSR999',
        name: 'Onnan',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Fullstack Developer',
        catatan: '-',
        statusBerakhir: 'Tidak Lolos Evaluasi',
        statusTerminasi: 'Selesai',
      },
      {
        id: '4',
        nip: 'DSR999',
        name: 'Maguire',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Fullstack Developer',
        catatan: '-',
        statusBerakhir: 'Tidak Memperpanjang (Evaluasi)',
        statusTerminasi: 'Selesai',
      },
      {
        id: '5',
        nip: 'DSR999',
        name: 'Muhyod',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Fullstack Developer',
        catatan: '-',
        statusBerakhir: 'Tidak Lolos Evaluasi',
        statusTerminasi: 'Selesai',
      },
      {
        id: '6',
        nip: 'DSR999',
        name: 'Lindsey Curtis',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Backend Developer',
        catatan: '-',
        statusBerakhir: 'New Child',
        statusTerminasi: 'Sedang diproses',
      },
      {
        id: '7',
        nip: 'DSR999',
        name: 'Kaiya Curtis',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Human Resource',
        catatan: 'New Child',
        statusBerakhir: '-',
        statusTerminasi: 'Sedang diproses',
      },
      {
        id: '8',
        nip: 'DSR999',
        name: 'Carlo George',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Accounting',
        catatan: '-',
        statusBerakhir: '-',
        statusTerminasi: 'Sedang diproses',
      },
      {
        id: '9',
        nip: 'DSR999',
        name: 'Abram Schleifer',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Front End Developer',
        catatan: '-',
        statusBerakhir: '-',
        statusTerminasi: 'Sedang diproses',
      },
      {
        id: '10',
        nip: 'DSR999',
        name: 'Rain Schleifer',
        tanggalPengajuan: '15 Jul 2026',
        tanggalEfektif: '16 Jul 2026',
        posisi: 'Digital Marketer',
        catatan: '-',
        statusBerakhir: '-',
        statusTerminasi: 'Sedang diproses',
      },
    ],
    []
  );

  const columns: DataTableColumn<TerminationItem>[] = useMemo(
    () => [
      {
        id: 'no',
        label: 'No.',
        minWidth: 50,
        align: 'center',
        sortable: false,
        format: (_, row) => data.indexOf(row) + 1 + (page - 1) * limit,
      },
      { id: 'nip', label: 'NIP', minWidth: 100, sortable: true },
      { id: 'name', label: 'Pengguna', minWidth: 160, sortable: true },
      { id: 'tanggalPengajuan', label: 'Tanggal Pengajuan', minWidth: 140, sortable: true },
      { id: 'tanggalEfektif', label: 'Tanggal Efektif', minWidth: 140, sortable: true },
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
    [data, page, limit]
  );

  const actions: DataTableAction<TerminationItem>[] = [
    {
      icon: <IconFileDetail />,
      onClick: (row) => navigate(`/resignation/termination-administration/${row.id}`),
      condition: (row) => row.statusTerminasi === 'Selesai',
    },
    {
      icon: <IconPencil />,
      onClick: (row) => navigate(`/resignation/termination-administration/${row.id}`),
      color: 'warning',
      condition: (row) => row.statusTerminasi === 'Sedang diproses',
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Terminasi Administrasi"
        data={data}
        columns={columns}
        actions={actions}
        searchable
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={limit}
        pageSizeOptions={[5, 10, 25, 50]}
        filterable
        addButtonLabel="Tambah Terminasi"
        // toolbarRightSlot={
        //   <div className="relative">
        //     <Button
        //       onClick={() => setIsStatusDropdownOpen((v) => !v)}
        //       variant="outline"
        //       size="sm"
        //       className="flex items-center gap-1"
        //     >
        //       Filter
        //       <ChevronDown size={16} />
        //     </Button>
        //     <Dropdown isOpen={isStatusDropdownOpen} onClose={() => setIsStatusDropdownOpen(false)}>
        //       <div className="p-2 w-48">
        //         <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Selesai</button>
        //         <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Sedang diproses</button>
        //       </div>
        //     </Dropdown>
        //   </div>
        // }
        onPageChangeExternal={(p) => setPage(p)}
        onRowsPerPageChangeExternal={(n) => setLimit(n)}
      />
    </div>
  );
}
