// Dokumentasi: Tabel Kompensasi menggunakan DataTable dengan kolom No., Level Jabatan, Kategori, General, Junior, Middle, Senior, dan Aksi
// Dokumentasi: Integrasi Modal EditKompensasiModal - buka saat tombol edit diklik
import { useMemo, useState } from 'react';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
// import { Edit } from 'react-feather';
import { IconPencil } from '@/icons/components/icons';
import EditKompensasiModal, { type EditKompensasiForm } from '@/features/payroll/components/modals/payroll-configuration/compensation/editCompensationModal';

type CompensationRow = {
  no?: number;
  levelJabatan: string;
  kategori: string;
  general: string;
  junior: string;
  middle: string;
  senior: string;
};

export default function KompensasiPage() {
  // Dokumentasi: State kendali modal edit kompensasi
  const [showEdit, setShowEdit] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<EditKompensasiForm | null>(null);
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
  const columns: DataTableColumn<CompensationRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'levelJabatan', label: 'Level Jabatan', sortable: true },
    { id: 'kategori', label: 'Kategori', sortable: true },
    { id: 'general', label: 'General', align: 'center', sortable: true },
    { id: 'junior', label: 'Junior', align: 'center', sortable: true },
    { id: 'middle', label: 'Middle', align: 'center', sortable: true },
    { id: 'senior', label: 'Senior', align: 'center', sortable: true },
  ];

  const actions: DataTableAction<CompensationRow>[] = [
    {
      label: '',
      icon: <IconPencil  />,
      onClick: (row) => {
        // Dokumentasi: Buka modal edit dengan data baris
        setRowToEdit({
          levelJabatan: row.levelJabatan,
          kategori: row.kategori,
          general: row.general,
          junior: row.junior,
          middle: row.middle,
          senior: row.senior,
        });
        setShowEdit(true);
      },
      variant: 'outline',
      className: 'border-0',
    },
  ];

  const rows: CompensationRow[] = useMemo(() => (
    [
      { levelJabatan: 'Direktur', kategori: 'Gaji Pokok', general: '-', junior: '3.524.238', middle: '3.524.238', senior: '5.000.000' },
      { levelJabatan: 'Manager', kategori: 'Gaji Pokok', general: '-', junior: '4.100.000', middle: '4.100.000', senior: '5.000.000' },
      { levelJabatan: 'Supervisor', kategori: 'Gaji Pokok', general: '-', junior: '3.524.238', middle: '3.524.238', senior: '5.000.000' },
      { levelJabatan: 'Senior Officer', kategori: 'Gaji Pokok', general: '-', junior: '3.524.238', middle: '3.524.238', senior: '5.000.000' },
      { levelJabatan: 'Officer', kategori: 'Gaji Pokok', general: '-', junior: '4.000.000', middle: '4.000.000', senior: '5.000.000' },
      { levelJabatan: 'Entry Level', kategori: 'Gaji Pokok', general: '-', junior: '5.000.000', middle: '5.000.000', senior: '5.000.000' },
      { levelJabatan: 'Under Staff - Internship', kategori: 'Uang Saku', general: '-', junior: '2.000.000', middle: '2.000.000', senior: '3.000.000' },
      { levelJabatan: 'Under Staff - PKL', kategori: 'Uang Saku', general: '1.000.000', junior: '-', middle: '-', senior: '-' },
    ]
  ), []);

  return (
    <div className="p-4">
      <DataTable
        title="Kompensasi"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        onExport={() => exportCSV('kompensasi.csv', rows)}
      />
      {/* Dokumentasi: Render modal edit kompensasi ketika state showEdit true */}
      <EditKompensasiModal
        isOpen={showEdit}
        initialData={rowToEdit}
        onClose={() => { setShowEdit(false); setRowToEdit(null); }}
        onSubmit={(data) => {
          // Dokumentasi: Simpan perubahan (sementara: log). Integrasi API atau state update di masa depan.
          console.log('simpan perubahan kompensasi', data);
          setShowEdit(false);
          setRowToEdit(null);
        }}
      />
    </div>
  );
}
