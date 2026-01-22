// Dokumentasi: Modal Edit/Detail Tunjangan Jabatan & BPJS
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Checkbox from '@/components/form/input/Checkbox';
import { useEditPositionAndBPJSAllowanceModal, BpjsRow } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditPositionAndBPJSAllowanceModal';
import { PositionAllowanceDetailResponse, PositionAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/PositionAllowanceType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'detail' | 'edit';
  defaultValues?: PositionAllowanceDetailResponse | null;
  onSave?: (values: PositionAllowanceUpdatePayload) => void;
  isLoading?: boolean;
}

// Dokumentasi: Komponen utama modal. Judul menyesuaikan mode (detail/edit)
const EditDetailTunjanganJabatanDanBpjsModal: React.FC<Props> = ({ isOpen, onClose, mode, defaultValues, onSave, isLoading }) => {
  const { form, setField, updateBpjs, handleSubmit } = useEditPositionAndBPJSAllowanceModal({
    defaultValues,
    onSave,
    onClose,
    mode,
  });

  const isDetail = mode === 'detail';

  const content = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <InputField
          label="Jabatan"
          placeholder="Pilih Jabatan"
          value={form.jabatan}
          onChange={(e) => setField('jabatan', e.target.value)}
          disabled
          className="bg-gray-100"
        />
        <InputField
          label="% Persentase"
          placeholder="Contoh: 10"
          value={form.percent}
          onChange={(e) => setField('percent', e.target.value)}
          readonly={isDetail || !!form.nominal}
          required={!isDetail && !form.nominal}
          className={isDetail || !!form.nominal ? "bg-gray-100 cursor-not-allowed" : ""}
          disabled={isDetail}
        />
        <InputField
          label="Nominal"
          placeholder="Contoh: 4.100.000"
          value={form.nominal}
          onChange={(e) => setField('nominal', e.target.value)}
          readonly={isDetail || !!form.percent}
          required={!isDetail && !form.percent}
          className={isDetail || !!form.percent ? "bg-gray-100 cursor-not-allowed" : ""}
          disabled={isDetail}
        />
      </div>

      <ExpandCard title="Detail BPJS Ketenagakerjaan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={form.ketenagakerjaan as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jenisBpjs', label: 'Jenis BPJS', render: (_v: any, row: BpjsRow) => (
              <Checkbox label={row.jenisBpjs} checked={!!row.selected} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'selected', c)} disabled={isDetail} />
            ) },
            { id: 'tt', label: 'Tunjangan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center">
                {row.tunjanganId && <Checkbox checked={!!row.tt} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'tt', c)} disabled={isDetail} />}
              </div>
            ) },
            { id: 'pt', label: 'Potongan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center">
                {row.potonganId && <Checkbox checked={!!row.pt} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'pt', c)} disabled={isDetail} />}
              </div>
            ) },
          ] as any}
          actionsForRow={() => []}
          isAction={false}
        />
      </ExpandCard>

      <ExpandCard title="Detail BPJS Kesehatan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={form.kesehatan as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jenisBpjs', label: 'Jenis BPJS', render: (_v: any, row: BpjsRow) => (
              <Checkbox label={row.jenisBpjs} checked={!!row.selected} onChange={(c) => updateBpjs('kesehatan', row.id, 'selected', c)} disabled={isDetail} />
            ) },
            { id: 'tt', label: 'Tunjangan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center">
                {row.tunjanganId && <Checkbox checked={!!row.tt} onChange={(c) => updateBpjs('kesehatan', row.id, 'tt', c)} disabled={isDetail} />}
              </div>
            ) },
            { id: 'pt', label: 'Potongan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center">
                {row.potonganId && <Checkbox checked={!!row.pt} onChange={(c) => updateBpjs('kesehatan', row.id, 'pt', c)} disabled={isDetail} />}
              </div>
            ) },
          ] as any}
          actionsForRow={() => []}
          isAction={false}
        />
      </ExpandCard>
    </div>
  );

  return (
    <ModalAddEdit
      title={mode === 'detail' ? 'Detail Tunjangan Jabatan' : 'Edit Tunjangan Jabatan'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isLoading ?? false}
      maxWidth="max-w-4xl"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
      isSubmit={!isDetail}
    />
  );
};

export default EditDetailTunjanganJabatanDanBpjsModal;
