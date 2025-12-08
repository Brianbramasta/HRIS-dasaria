// Dokumentasi: Tabel BPJS menggunakan DataTable dengan kolom No., Detail BPJS, Kategori BPJS, Jenis, %Value, dan Aksi
import { useMemo } from 'react';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
// import { Edit } from 'react-feather';
import { IconPencil } from '@/icons/components/icons';

type BpjsRow = {
  no?: number;
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
};

export default function BpjsPage() {
  // Dokumentasi: util sederhana untuk ekspor data ke CSV mengikuti pola halaman lain
  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const columns: DataTableColumn<BpjsRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'detailBpjs', label: 'Detail BPJS', sortable: true },
    { id: 'kategoriBpjs', label: 'Kategori BPJS', sortable: true },
    { id: 'jenis', label: 'Jenis', sortable: true, align: 'center' },
    { id: 'percent', label: '%Value', sortable: true, align: 'center' },
  ];

  const actions: DataTableAction<BpjsRow>[] = [
    {
      label: '',
      icon: <IconPencil />,
      onClick: (row) => {
        console.log('edit bpjs', row);
      },
      variant: 'outline',
      className: 'border-0',
    },
  ];

  const rows: BpjsRow[] = useMemo(() => (
    [
      { detailBpjs: 'BPJS Kesehatan - Iuran Karyawan', kategoriBpjs: 'Kesehatan', jenis: 'Potongan', percent: '1%' },
      { detailBpjs: 'BPJS Ketenagakerjaan - JHT', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Potongan', percent: '2%' },
      { detailBpjs: 'BPJS Ketenagakerjaan - JP', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Potongan', percent: '1%'},
      { detailBpjs: 'BPJS Ketenagakerjaan - JKK', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Tunjangan', percent: '0.24%'},
    ]
  ), []);

  return (
    <div className="p-4">
      <DataTable
        title="BPJS"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('bpjs.csv', rows)}
      />
    </div>
  );
}
