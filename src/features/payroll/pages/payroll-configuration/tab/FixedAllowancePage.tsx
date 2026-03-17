// Dokumentasi: Halaman Tunjangan Tetap + integrasi tiga Modal Edit (Pernikahan, Lama Kerja, Transportasi)
import { useState } from 'react';
import DataTable from '@/components/shared/datatable/DataTable';
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
        <DataTable
          border={false}
          resetKey='position-allowance'
          data={positionAllowanceRows}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'jabatan', label: 'Jabatan', sortable: true },
            { id: 'presentase', label: 'Presentase', align: 'center', sortable: true },
            { 
              id: 'nominal', 
              label: 'Nominal', 
              align: 'right', 
              sortable: true,
              format: (_v: any, row: any) => formatCurrency(row.nominal || 0) 
            },
            {
              id: 'detailBpjs', 
              label: 'Detail BPJS', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => (
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
          ]}
          actions={[
            {
              icon: <IconPencil />, 
              onClick: (row: any) => {
                setPositionMode('edit');
                handleEditOpenPosition(row);
              }
            }
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari tunjangan jabatan..."
          emptyMessage="Tidak ada data tunjangan jabatan"
          disablePagination={false}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Pernikahan" withHeaderDivider defaultOpen>
        <DataTable
          border={false}
          resetKey='marriage-allowance'
          data={marriageAllowanceRows}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'statusPernikahan', label: 'Status Pernikahan', sortable: true },
            { id: 'status', label: 'Status', sortable: true },
            { id: 'tanggungan', label: 'Tanggungan', align: 'center', sortable: true },
            { 
              id: 'nominal', 
              label: 'Nominal', 
              align: 'right', 
              sortable: true,
              format: (_v: any, row: any) => formatCurrency(row.nominal || 0) 
            },
          ]}
          actions={[
            { 
              icon: <IconPencil />, 
              onClick: (row: any) => handleEditOpenMarriage(row) 
            }
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari tunjangan pernikahan..."
          emptyMessage="Tidak ada data tunjangan pernikahan"
          disablePagination={false}
        />
      </ExpandCard>

      <ExpandCard title="Tunjangan Lama Kerja" withHeaderDivider defaultOpen>
        <DataTable
          border={false}
          resetKey='length-of-service-allowance'
          data={lengthOfServiceRows}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'lamaKerja', label: 'Lama Kerja', sortable: true },
            { 
              id: 'nominal', 
              label: 'Nominal', 
              align: 'right', 
              sortable: true,
              format: (_v: any, row: any) => formatCurrency(row.nominal || 0) 
            },
          ]}
          actions={[
            { 
              icon: <IconPencil />, 
              onClick: (row: any) => handleEditOpenLengthOfService(row) 
            }
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari tunjangan lama kerja..."
          emptyMessage="Tidak ada data tunjangan lama kerja"
          disablePagination={false}
        />
      </ExpandCard>

      {/* <ExpandCard title="FEE" withHeaderDivider defaultOpen>
        <DataTable
          border={false}
          resetKey='fee-allowance'
          data={feeAllowanceRows}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'namaFee', label: 'Nama FEE', sortable: true },
            { 
              id: 'nominal', 
              label: 'Nominal', 
              align: 'right', 
              sortable: true,
              format: (_v: any, row: any) => formatCurrency(row.nominal || 0) 
            },
          ]}
          actions={[
            { 
              icon: <IconPencil />, 
              onClick: (row: any) => handleEditOpenFee(row) 
            }
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari fee..."
          emptyMessage="Tidak ada data fee"
          disablePagination={false}
        />
      </ExpandCard> */}

      {/* <ExpandCard title="Tunjangan Transportasi" withHeaderDivider defaultOpen>
        <DataTable
          border={false}
          resetKey='transportation-allowance'
          data={transportationAllowanceRows}
          maxHeight='max-w-full'
          columns={[
            { 
              id: 'no', 
              label: 'No.', 
              align: 'center', 
              sortable: false,
              format: (_v: any, row: any) => row._index + 1 
            },
            { id: 'transportasi', label: 'Transportasi', sortable: true },
            { id: 'kategori', label: 'Kategori', sortable: true },
            { 
              id: 'nominal', 
              label: 'Nominal', 
              align: 'right', 
              sortable: true,
              format: (_v: any, row: any) => formatCurrency(row.nominal || 0) 
            },
          ]}
          actions={[
            { 
              icon: <IconPencil />, 
              onClick: (row: any) => handleEditOpenTransportation(row) 
            }
          ]}
          filterable={false}
          searchable={true}
          searchPlaceholder="Cari tunjangan transportasi..."
          emptyMessage="Tidak ada data tunjangan transportasi"
          disablePagination={false}
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
