

// Dokumentasi: Tabel Tunjangan Hari Raya + integrasi Modal Edit THR
import  { useMemo, useState } from 'react';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import { IconPencil } from '@/icons/components/icons';
import Switch from '@/components/form/switch/Switch';
import EditThrModal from '@/features/payroll/components/modals/payroll-configuration/thr/EditThrModal';

type THRConfigRow = {
  no?: number;
  'Lama Kerja': string;
  'Deksripsi Umum': string;
};

export default function THRPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<{ lamaKerja: string; deskripsiUmum: string } | null>(null);

  const columns: DataTableColumn<THRConfigRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Lama Kerja', label: 'Lama Kerja', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<THRConfigRow>[] = [
    { label: '', icon: <IconPencil />, onClick: (row) => {
      setDefaultValues({ lamaKerja: row['Lama Kerja'], deskripsiUmum: row['Deksripsi Umum'] });
      setIsModalOpen(true);
    }, variant: 'outline', className: 'border-0' },
  ];

  const rows: THRConfigRow[] = useMemo(() => (
    [
      { 'Lama Kerja': 'Kurang dari 1 Tahun', 'Deksripsi Umum': 'Masa Kerja: Dihitung dalam satuan bulan.' },
      { 'Lama Kerja': '1 tahun atau lebih', 'Deksripsi Umum': 'THR dibayarkan 1 (satu) kali Gaji Penuh.' },
    ]
  ), []);

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',') , ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
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

  const switchSlot = (
    <Switch
      label={isEnabled ? 'ON' : 'OFF'}
      defaultChecked={isEnabled}
      onChange={setIsEnabled}
      color="blue"
    />
  );

  return (
    <div className="p-4">
      <DataTable
        title="Tunjangan Hari Raya"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('tunjangan-hari-raya.csv', rows)}
        onAdd={() => console.log('tambah potongan')}
        addButtonLabel="Tambah Potongan"
        toolbarRightSlotAtas={switchSlot}
      />
      {isModalOpen && (
        <EditThrModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultValues={defaultValues}
          onSave={(values) => { console.log('save thr', values); }}
        />
      )}
    </div>
  );
}
