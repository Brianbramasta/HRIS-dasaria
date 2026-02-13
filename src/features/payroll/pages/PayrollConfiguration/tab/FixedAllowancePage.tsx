// Dokumentasi: Halaman Tunjangan Tetap + integrasi tiga Modal Edit (Pernikahan, Lama Kerja, Transportasi)
import { useState } from 'react';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { IconFileDetail, IconPencil } from '@/icons/components/icons';
import EditTunjanganPernikahanModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditMarriageAllowanceModal';
import EditTunjanganLamaKerjaModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditLengthOfServiceAllowanceModal';
// import EditFeeModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditFeeModal';
// import EditTunjanganTransportasiModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditTransportationAllowanceModal';
// Dokumentasi: Integrasi modal Edit/Detail Tunjangan Jabatan & BPJS
import EditDetailTunjanganJabatanDanBpjsModal from '@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditPositionAndBPJSAllowanceModal';
import { useMarriageAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useMarriageAllowance';
import { useLengthOfServiceAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useLengthOfServiceAllowance';
import { usePositionAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/usePositionAllowance';
// import { useTransportationAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useTransportationAllowance';
// import { useFeeAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useFeeAllowance';
import { formatCurrency } from '@/utils/formatCurrency';

export default function TunjanganTetapPage() {
  const [positionMode, setPositionMode] = useState<'detail' | 'edit'>('edit');

  // Dokumentasi: Integrasi hook usePositionAllowance untuk Tunjangan Jabatan & BPJS
  const {
    positionAllowanceRows,
    loading: loadingPosition,
    editModal: editModalPosition,
    handleEditOpen: handleEditOpenPosition,
    handleUpdate: handleUpdatePosition,
    selected: selectedPosition,
  } = usePositionAllowance();

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

  // Dokumentasi: Integrasi hook useTransportationAllowance untuk Tunjangan Transportasi
  // const {
  //   transportationAllowanceRows,
  //   loading: loadingTransportation,
  //   editModal: editModalTransportation,
  //   handleEditOpen: handleEditOpenTransportation,
  //   handleUpdate: handleUpdateTransportation,
  //   selected: selectedTransportation,
  // } = useTransportationAllowance();

  // const {
  //   feeAllowanceRows,
  //   handleEditOpen: handleEditOpenFee,
  //   editModal: editModalFee,
  //   handleUpdate: handleUpdateFee,
  //   selected: selectedFee,
  //   loading: loadingFee,
  // } = useFeeAllowance();

  return (
    <div className="space-y-6 p-4">
      <ExpandCard title="Tunjangan Jabatan dan BPJS" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={positionAllowanceRows as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jabatan', label: 'Jabatan' },
            { id: 'presentase', label: 'Presentase', align: 'center' },
            { id: 'nominal', label: 'Nominal', align: 'right', render: (val: any) => formatCurrency(val || 0) },
            {
              id: 'detailBpjs', label: 'Detail  BPJS', align: 'center', render: (_v: any, row: any) => (
                // Dokumentasi: tombol Detail membuka modal Detail Tunjangan Jabatan
                <button
                  onClick={() => {
                    setPositionMode('detail');
                    handleEditOpenPosition(row);
                  }}
                  className="flex items-center justify-center w-full"
                >
                  <IconFileDetail />
                </button>
              )
            },
          ] as any}
          // Dokumentasi: tombol Edit membuka modal Edit Tunjangan Jabatan
          actions={[{
            icon: <IconPencil />, onClick: (row: any) => {
              setPositionMode('edit');
              handleEditOpenPosition(row);
            }
          }]}
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

      {/* <ExpandCard title="FEE" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={feeAllowanceRows as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'namaFee', label: 'Nama FEE' },
            { id: 'nominal', label: 'Nominal', align: 'right', render: (val: any) => formatCurrency(val || 0) },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => handleEditOpenFee(row) }]}
        />
      </ExpandCard> */}

      {/* <ExpandCard title="Tunjangan Transportasi" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={transportationAllowanceRows as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'transportasi', label: 'Transportasi' },
            { id: 'kategori', label: 'Kategori' },
            { id: 'nominal', label: 'Nominal', align: 'right', render: (val: any) => formatCurrency(val || 0) },
          ] as any}
          actions={[{ icon: <IconPencil />, onClick: (row: any) => handleEditOpenTransportation(row) }]}
        />
      </ExpandCard> */}

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
      {/* <EditFeeModal
        isOpen={editModalFee.isOpen}
        onClose={editModalFee.closeModal}
        defaultValues={selectedFee}
        onSave={handleUpdateFee}
        isLoading={loadingFee}
      /> */}
      {/* <EditTunjanganTransportasiModal
        isOpen={editModalTransportation.isOpen}
        onClose={editModalTransportation.closeModal}
        defaultValues={selectedTransportation}
        onSave={handleUpdateTransportation}
        isLoading={loadingTransportation}
      /> */}
      {/* Dokumentasi: render modal Edit/Detail Tunjangan Jabatan & BPJS */}
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={editModalPosition.isOpen}
        onClose={editModalPosition.closeModal}
        mode={positionMode}
        defaultValues={selectedPosition}
        onSave={handleUpdatePosition}
        isLoading={loadingPosition}
      />
    </div>
  );
}
