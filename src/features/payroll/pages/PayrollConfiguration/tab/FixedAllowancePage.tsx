// Dokumentasi: Halaman Tunjangan Tetap + integrasi tiga Modal Edit (Pernikahan, Lama Kerja, Transportasi)
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { IconFileDetail, IconPencil } from '@/icons/components/icons';
import { useState } from 'react';
import EditTunjanganPernikahanModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditMarriageAllowanceModal';
import EditTunjanganLamaKerjaModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditLengthOfServiceAllowanceModal';
import EditTunjanganTransportasiModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditTransportationAllowanceModal';
// Dokumentasi: Integrasi modal Edit/Detail Tunjangan Jabatan & BPJS
import EditDetailTunjanganJabatanDanBpjsModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditPositionAndBPJSAllowanceModal';
import { useMarriageAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useMarriageAllowance';
import { useLengthOfServiceAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useLengthOfServiceAllowance';
import { formatCurrency } from '@/utils/formatCurrency';

export default function TunjanganTetapPage() {
  const jabatanBpjsItems = [
    { id: 1, jabatan: 'Entry Level', presentase: '10%', nominal: '4.100.000', detailBpjs: 'link-doc-1', fileUrl: '#' },
    { id: 2, jabatan: 'Officer', presentase: '12%', nominal: '4.100.000', detailBpjs: 'link-doc-2', fileUrl: '#' },
    { id: 3, jabatan: 'Senior Officer', presentase: '14%', nominal: '4.100.000', detailBpjs: 'link-doc-3', fileUrl: '#' },
    { id: 4, jabatan: 'Supervisor', presentase: '16%', nominal: '4.100.000', detailBpjs: 'link-doc-4', fileUrl: '#' },
    { id: 5, jabatan: 'Manager', presentase: '18%', nominal: '4.100.000', detailBpjs: 'link-doc-5', fileUrl: '#' },
    { id: 6, jabatan: 'Direktur', presentase: '20%', nominal: '4.100.000', detailBpjs: 'link-doc-6', fileUrl: '#' },
  ];

  // Dokumentasi: state & handler untuk modal Tunjangan Jabatan & BPJS
  const [isEditDetailJabatanOpen, setEditDetailJabatanOpen] = useState(false);
  const [modeEditDetail, setModeEditDetail] = useState<'detail' | 'edit'>('detail');
  const [selectedJabatanIndex, setSelectedJabatanIndex] = useState<number | null>(null);

  // Dokumentasi: Integrasi hook useMarriageAllowance untuk Tunjangan Pernikahan
  const { 
    marriageAllowanceRows, 
    loading: loadingMarriage, 
    editModal: editModalMarriage, 
    handleEditOpen: handleEditOpenMarriage, 
    handleUpdate: handleUpdateMarriage,
    selected: selectedMarriage
  } = useMarriageAllowance();

  // Dokumentasi: Integrasi hook useLengthOfServiceAllowance untuk Tunjangan Lama Kerja
  const {
    lengthOfServiceRows,
    loading: loadingLengthOfService,
    editModal: editModalLengthOfService,
    handleEditOpen: handleEditOpenLengthOfService,
    handleUpdate: handleUpdateLengthOfService,
    selected: selectedLengthOfService
  } = useLengthOfServiceAllowance();

  // Dokumentasi: state tabel Tunjangan Transportasi + handler modal
  const [transportasiItems, setTransportasiItems] = useState([
    { id: 1, transportasi: 'Transportasi-01', kategori: 'Staff', nominal: '1.000.000' },
    { id: 2, transportasi: 'Transportasi-02', kategori: 'Kemitraan', nominal: '1.000.000' },
  ]);
  const [isEditTransportasiOpen, setEditTransportasiOpen] = useState(false);
  const [selectedTransportasiIndex, setSelectedTransportasiIndex] = useState<number | null>(null);

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
              // Dokumentasi: tombol Detail membuka modal Detail Tunjangan Jabatan
              <button onClick={() => { const idx = jabatanBpjsItems.indexOf(row); setSelectedJabatanIndex(idx >= 0 ? idx : null); setModeEditDetail('detail'); setEditDetailJabatanOpen(true); }} className="flex items-center justify-center"><IconFileDetail /></button>
            ) },
          ] as any}
          // Dokumentasi: tombol Edit membuka modal Edit Tunjangan Jabatan
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { const idx = jabatanBpjsItems.indexOf(row); setSelectedJabatanIndex(idx >= 0 ? idx : null); setModeEditDetail('edit'); setEditDetailJabatanOpen(true); } }]}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Pernikahan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={marriageAllowanceRows as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'statusPernikahan', label: 'Status Pernikahan' },
            { id: 'status', label: 'Status' },
            { id: 'tanggungan', label: 'Tanggungan', align: 'center' },
            { id: 'nominal', label: 'Nominal', align: 'right', render: (val: any) => formatCurrency(val || 0) },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => handleEditOpenMarriage(row) }]}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Lama Kerja" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={lengthOfServiceRows as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'lamaKerja', label: 'Lama Kerja' },
            { id: 'nominal', label: 'Nominal', align: 'right', render: (val: any) => formatCurrency(val || 0) },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => handleEditOpenLengthOfService(row) }]}
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
          actions={[{ icon: <IconPencil />, onClick: (row: any) => { const idx = transportasiItems.indexOf(row); setSelectedTransportasiIndex(idx >= 0 ? idx : null); setEditTransportasiOpen(true); } }]}
        />
      </ExpandCard>
      {/* Dokumentasi: render tiga modal edit dan handler simpan untuk masing-masing section */}
      <EditTunjanganPernikahanModal
        isOpen={editModalMarriage.isOpen}
        onClose={editModalMarriage.closeModal}
        defaultValues={selectedMarriage}
        onSave={handleUpdateMarriage}
        isLoading={loadingMarriage}
      />
      <EditTunjanganLamaKerjaModal
        isOpen={editModalLengthOfService.isOpen}
        onClose={editModalLengthOfService.closeModal}
        defaultValues={selectedLengthOfService as any}
        onSave={handleUpdateLengthOfService}
        isLoading={loadingLengthOfService}
      />
      <EditTunjanganTransportasiModal
        isOpen={isEditTransportasiOpen}
        onClose={() => setEditTransportasiOpen(false)}
        defaultValues={selectedTransportasiIndex !== null ? transportasiItems[selectedTransportasiIndex] : undefined}
        onSave={(values) => {
          if (selectedTransportasiIndex === null) return;
          setTransportasiItems((prev) => prev.map((r, i) => i === selectedTransportasiIndex ? { ...r, ...values } : r));
        }}
      />
      {/* Dokumentasi: render modal Edit/Detail Tunjangan Jabatan & BPJS */}
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={isEditDetailJabatanOpen}
        onClose={() => setEditDetailJabatanOpen(false)}
        mode={modeEditDetail}
        defaultValues={selectedJabatanIndex !== null ? {
          jabatan: jabatanBpjsItems[selectedJabatanIndex].jabatan,
          percent: jabatanBpjsItems[selectedJabatanIndex].presentase,
          nominal: jabatanBpjsItems[selectedJabatanIndex].nominal,
        } : undefined}
      />
    </div>
  );
}
