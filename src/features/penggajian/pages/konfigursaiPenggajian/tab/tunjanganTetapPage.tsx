// Dokumentasi: Halaman Tunjangan Tetap berisi 4 section tabel menggunakan ExpandCard + TableGlobal
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { IconFileDetail, IconPencil } from '@/icons/components/icons';

export default function TunjanganTetapPage() {
  const jabatanBpjsItems = [
    { id: 1, jabatan: 'Entry Level', presentase: '10%', nominal: '4.100.000', detailBpjs: 'link-doc-1', fileUrl: '#' },
    { id: 2, jabatan: 'Officer', presentase: '12%', nominal: '4.100.000', detailBpjs: 'link-doc-2', fileUrl: '#' },
    { id: 3, jabatan: 'Senior Officer', presentase: '14%', nominal: '4.100.000', detailBpjs: 'link-doc-3', fileUrl: '#' },
    { id: 4, jabatan: 'Supervisor', presentase: '16%', nominal: '4.100.000', detailBpjs: 'link-doc-4', fileUrl: '#' },
    { id: 5, jabatan: 'Manager', presentase: '18%', nominal: '4.100.000', detailBpjs: 'link-doc-5', fileUrl: '#' },
    { id: 6, jabatan: 'Direktur', presentase: '20%', nominal: '4.100.000', detailBpjs: 'link-doc-6', fileUrl: '#' },
  ];

  const pernikahanItems = [
    { id: 1, statusPernikahan: 'TK/0', status: 'Tidak Menikah', tanggungan: 0, nominal: '3.524.238' },
    { id: 2, statusPernikahan: 'TK/1', status: 'Tidak Menikah', tanggungan: 1, nominal: '4.100.000' },
    { id: 3, statusPernikahan: 'TK/2', status: 'Tidak Menikah', tanggungan: 2, nominal: '4.100.000' },
    { id: 4, statusPernikahan: 'TK/3', status: 'Tidak Menikah', tanggungan: 3, nominal: '3.524.238' },
    { id: 5, statusPernikahan: 'K/0', status: 'Menikah', tanggungan: 0, nominal: '3.524.238' },
    { id: 6, statusPernikahan: 'K/1', status: 'Menikah', tanggungan: 1, nominal: '3.524.238' },
    { id: 7, statusPernikahan: 'K/2', status: 'Menikah', tanggungan: 2, nominal: '3.524.238' },
    { id: 8, statusPernikahan: 'K/3', status: 'Menikah', tanggungan: 3, nominal: '3.524.238' },
  ];

  const lamaKerjaItems = [
    { id: 1, lamaKerja: 'Tahun Ke-1', nominal: '3.524.238' },
    { id: 2, lamaKerja: 'Tahun Ke-2', nominal: '4.100.000' },
    { id: 3, lamaKerja: 'Tahun Ke-3', nominal: '3.524.238' },
    { id: 4, lamaKerja: 'Tahun Ke-4', nominal: '3.524.238' },
    { id: 5, lamaKerja: 'Tahun Ke-5', nominal: '3.524.238' },
  ];

  const transportasiItems = [
    { id: 1, transportasi: 'Transportasi-01', kategori: 'Staff', nominal: '1.000.000' },
    { id: 2, transportasi: 'Transportasi-02', kategori: 'Kemitraan', nominal: '1.000.000' },
  ];

  return (
    <div className="space-y-6 p-4">
      <ExpandCard title="Tunjangan Jabatan dan BPJS" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={jabatanBpjsItems as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jabatan', label: 'Jabatan' },
            { id: 'presentase', label: 'Presentase', align: 'center' },
            { id: 'nominal', label: 'Nominal', align: 'right' },
            { id: 'detailBpjs', label: 'Detail  BPJS', align: 'center', render: (_v: any, row: any) => (
              <button onClick={() => window.open(row.fileUrl, '_blank')} className="flex items-center justify-center"><IconFileDetail /></button>
            ) },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { console.log('edit', row); } }]}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Pernikahan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={pernikahanItems as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'statusPernikahan', label: 'Status Pernikahan' },
            { id: 'status', label: 'Status' },
            { id: 'tanggungan', label: 'Tanggungan', align: 'center' },
            { id: 'nominal', label: 'Nominal', align: 'right' },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { console.log('edit', row); } }]}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Lama Kerja" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={lamaKerjaItems as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'lamaKerja', label: 'Lama Kerja' },
            { id: 'nominal', label: 'Nominal', align: 'right' },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { console.log('edit', row); } }]}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Transportasi" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={transportasiItems as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'transportasi', label: 'Transportasi' },
            { id: 'kategori', label: 'Kategori' },
            { id: 'nominal', label: 'Nominal', align: 'right' },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { console.log('edit', row); } }]}
        />
      </ExpandCard>
    </div>
  );
}
