// Dokumentasi: Halaman Acuan Potongan + integrasi Modal Edit untuk update data
import  {  useState } from 'react';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import EditAcuanPotonganModal from '@/features/payroll/components/modals/payroll-configuration/deduction-reference/EditDeductionReferenceModal';

type AcuanPotonganRow = {
  no?: number;
  acuanPotongan: string;
  kategori: string;
  nominal: string;
  keterangan: string;
};

export default function AcuanPotonganPage() {
  const columns: DataTableColumn<AcuanPotonganRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'acuanPotongan', label: 'Acuan Potongan', sortable: true },
    { id: 'kategori', label: 'Kategori', sortable: true },
    { id: 'nominal', label: 'Nominal', align: 'right', sortable: true },
    { id: 'keterangan', label: 'Keterangan', sortable: false },
  ];

  const [rows, setRows] = useState<AcuanPotonganRow[]>([
    { acuanPotongan: 'UMR', kategori: 'BPJS Kesehatan', nominal: '3.524.238', keterangan: '-' },
    { acuanPotongan: 'Non-UMR', kategori: 'BPJS Kesehatan', nominal: '4.100.000', keterangan: '-' },
    { acuanPotongan: 'Gaji Tipe 1', kategori: 'BPJS Ketenagakerjaan', nominal: '3.524.238', keterangan: 'Salary < UMK' },
    { acuanPotongan: 'Gaji Tipe 2', kategori: 'BPJS Ketenagakerjaan', nominal: '3.524.238', keterangan: 'Salary ≥ UMK' },
    { acuanPotongan: 'Gaji Tipe 3', kategori: 'BPJS Ketenagakerjaan', nominal: '4.000.000', keterangan: 'Salary > 4.000.000' },
    { acuanPotongan: 'Gaji Tipe 4', kategori: 'BPJS Ketenagakerjaan', nominal: '5.000.000', keterangan: 'Salary > 5.000.000' },
    { acuanPotongan: 'Gaji Tipe 5', kategori: 'BPJS Ketenagakerjaan', nominal: '7.000.000', keterangan: 'Salary > 7.000.000' },
    { acuanPotongan: 'Gaji Tipe 6', kategori: 'BPJS Ketenagakerjaan', nominal: '10.000.000', keterangan: 'Salary > 10.000.000' },
    { acuanPotongan: 'Gaji Tipe 7', kategori: 'BPJS Ketenagakerjaan', nominal: '12.000.000', keterangan: 'Salary > 13.000.000' },
  ]);

  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const actions: DataTableAction<AcuanPotonganRow>[] = [
    { label: '', icon: <IconHapus />, onClick: (row) => { console.log('hapus', row); }, variant: 'outline', className: 'border-0' },
    { label: '', icon: <IconPencil />, onClick: (row) => { const idx = rows.indexOf(row); setSelectedIndex(idx >= 0 ? idx : null); setEditOpen(true); }, variant: 'outline', className: 'border-0' },
  ];

  const handleSave = (values: { acuanPotongan: string; kategori: string; nominal: string; keterangan: string; }) => {
    if (selectedIndex === null) return;
    setRows((prev) => prev.map((r, i) => i === selectedIndex ? { ...r, ...values } : r));
  };

  // Dokumentasi: util sederhana untuk ekspor
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

  return (
    <div className="p-4">
      <DataTable
        title="Acuan Potongan"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('acuan-potongan.csv', rows)}
      />
      <EditAcuanPotonganModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        defaultValues={selectedIndex !== null ? rows[selectedIndex] : undefined}
        onSave={handleSave}
      />
    </div>
  );
}
