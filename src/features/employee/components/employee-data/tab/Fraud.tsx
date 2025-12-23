// import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
 
import { useMemo, useState } from 'react';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import PelanggaranModal, { type PelanggaranEntry } from '@/features/employee/components/modals/employee-data/fraud/FraudModal';
import { IconPencil } from '@/icons/components/icons';  
 

export default function PelanggaranTab() {
  const [list, setList] = useState<PelanggaranEntry[]>([
    {
      id: 1,
      jenisPelanggaran: 'Tidak Disiplin',
      tanggalKejadian: '2025-01-01',
      jenisTindakan: 'Surat Peringatan 1',
      masaBerlaku: '3 Bulan',
      deskripsi: 'Datang terlambat berulang kali',
      fileName: undefined,
    },
    {
      id: 2,
      jenisPelanggaran: 'Tidak Disiplin',
      tanggalKejadian: '2025-01-01',
      jenisTindakan: 'Surat Peringatan 1',
      masaBerlaku: '3 Bulan',
      deskripsi: 'Tidak mengikuti prosedur yang ditetapkan',
      fileName: undefined,
    },
    {
      id: 3,
      jenisPelanggaran: 'Tidak Disiplin',
      tanggalKejadian: '2025-01-01',
      jenisTindakan: 'Surat Peringatan 1',
      masaBerlaku: '3 Bulan',
      deskripsi: 'Pelaporan yang terlambat',
      fileName: undefined,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PelanggaranEntry | null>(null);

  const columns: DataTableColumn<PelanggaranEntry>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (v, row) => { void v; return list.findIndex((r) => r.id === row.id) + 1; } },
      { id: 'jenisPelanggaran', label: 'Jenis Pelanggaran' },
      { id: 'tanggalKejadian', label: 'Tanggal Kejadian', format: (v) => new Date(v).toLocaleDateString('id-ID') },
      
      { id: 'deskripsi', label: 'deskripsi Pelanggaran' },
      { id: 'jenisTindakan', label: 'Jenis Tindakan' },
      { id: 'dokumen', label: 'Dokumen', format: (v) => (v ? 'Terunggah' : '-') },
      
      { id: 'masaBerlaku', label: 'Masa Berlaku' },
    ],
    [list]
  );

  const actions: DataTableAction<PelanggaranEntry>[] = [
    {
      variant: 'outline',
      icon: <IconPencil/>,
      onClick: (row) => {
        setEditing(row);
        setIsOpen(true);
      },
    }
    // {
    //   label: 'Delete',
    //   variant: 'primary',
    //   onClick: (row) => {
    //     setList((prev) => prev.filter((r) => r.id !== row.id));
    //   },
    // },
  ];

  const handleAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const handleSave = (entry: PelanggaranEntry) => {
    setList((prev) => {
      if (entry.id) {
        return prev.map((r) => (r.id === entry.id ? { ...r, ...entry } : r));
      }
      const nextId = ((prev[prev.length - 1]?.id) ?? 0) + 1;
      return [...prev, { ...entry, id: nextId }];
    });
    setIsOpen(false);
    setEditing(null);
  };

  return (
    <>
     {/* <ExpandCard title="Pelanggaran" withHeaderDivider> */}
      <DataTable<PelanggaranEntry>
        title="Pelanggaran"
        data={list}
        columns={columns}
        actions={actions}
        filterable
        emptyMessage="Tidak ada catatan pelanggaran."
        addButtonLabel="Tambah Pelanggaran"
        onAdd={handleAdd}
      />

      <PelanggaranModal
        isOpen={isOpen}
        mode={editing ? 'edit' : 'add'}
        initialData={editing ?? undefined}
        onClose={() => {
          setIsOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />
      {/*  </ExpandCard> */}
    </>
    
  );
}