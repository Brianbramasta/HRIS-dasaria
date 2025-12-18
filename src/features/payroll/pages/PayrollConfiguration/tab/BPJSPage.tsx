// Dokumentasi: Halaman BPJS + integrasi Modal Edit BPJS untuk update data
import {  useState } from 'react';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
// import { Edit } from 'react-feather';
import { IconPencil } from '@/icons/components/icons';
import EditBpjsModal from '@/features/payroll/components/modals/payroll-configuration/bpjs/editBpjsModal';

type BpjsRow = {
  no?: number;
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
};

// Dokumentasi: Komponen utama halaman BPJS: render tabel dan kelola modal edit
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

  const [rows, setRows] = useState<BpjsRow[]>([
    { detailBpjs: 'BPJS Kesehatan - Iuran Karyawan', kategoriBpjs: 'Kesehatan', jenis: 'Potongan', percent: '1%' },
    { detailBpjs: 'BPJS Ketenagakerjaan - JHT', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Potongan', percent: '2%' },
    { detailBpjs: 'BPJS Ketenagakerjaan - JP', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Potongan', percent: '1%'},
    { detailBpjs: 'BPJS Ketenagakerjaan - JKK', kategoriBpjs: 'Ketenagakerjaan', jenis: 'Tunjangan', percent: '0.24%'},
  ]);

  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const actions: DataTableAction<BpjsRow>[] = [
    {
      label: '',
      icon: <IconPencil />,
      onClick: (row) => {
        const idx = rows.indexOf(row);
        setSelectedIndex(idx >= 0 ? idx : null);
        setEditOpen(true);
      },
      variant: 'outline',
      className: 'border-0',
    },
  ];

  const handleSave = (values: { detailBpjs: string; kategoriBpjs: string; jenis: string; percent: string; }) => {
    if (selectedIndex === null) return;
    setRows((prev) => prev.map((r, i) => i === selectedIndex ? { ...r, ...values } : r));
  };

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
      <EditBpjsModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        defaultValues={selectedIndex !== null ? rows[selectedIndex] : undefined}
        onSave={handleSave}
      />
    </div>
  );
}
