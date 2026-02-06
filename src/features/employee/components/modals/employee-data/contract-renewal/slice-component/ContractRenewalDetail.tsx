import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import DateField from '@/components/shared/field/DateField';
import FileField from '@/components/shared/field/FIleField';
import { useContractRenewalStore } from '../../../../../stores/useContractRenewalStore';
import { useEffect } from 'react';

interface ContractRenewalDetailProps {
  data?: {
    employee_id?: string;
    full_name?: string;
    position_name?: string;
    department_name?: string;
    join_date?: string;
    end_date?: string;
    remaining_contract?: string;
    renewal_status_name?: string;
    contract_type_id?: string;
    contract_type_name?: string;
    contract_number?: string;
    new_contract_date?: string;
    new_contract_end_date?: string;
    contract_document?: string;
    evaluation_document?: string;
    notes?: string;
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
  showLimitedFields?: boolean;
  statusOptions?: { value: string; label: string }[];
  contractTypeOptions?: { value: string; label: string }[];
}

export default function ContractRenewalDetail({
  data = {},
  isEditing = false,
  onChange,
  showLimitedFields = false,
  statusOptions = [],
  contractTypeOptions = [],
}: ContractRenewalDetailProps) {
  const { shouldShowAllDetailFields, setChangeTypeName } = useContractRenewalStore();

  // Auto-update store when renewal status changes
  useEffect(() => {
    if (data?.renewal_status_name) {
      const selectedOption = statusOptions.find((opt) => opt.value === data.renewal_status_name);
      const label = selectedOption ? selectedOption.label : data.renewal_status_name;
      setChangeTypeName(label);
    }
  }, [data?.renewal_status_name, setChangeTypeName, statusOptions]);

  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
    // Auto-update store when renewal status changes
    if (field === 'renewal_status_name') {
      const selectedOption = statusOptions.find((opt) => opt.value === value);
      const label = selectedOption ? selectedOption.label : value;
      setChangeTypeName(label);
    }
  };

  return (
    <PayrollCard
      title="Status Perpanjangan"
      headerColor="slate"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: NIP, Pengguna, Posisi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="NIP"
            value={data?.employee_id || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('employee_id', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Pengguna"
            value={data?.full_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Posisi"
            value={data?.position_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('position_name', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 2: Departemen, Tanggal Masuk, Tanggal Berakhir */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Departemen"
            value={data?.department_name || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('department_name', e.target.value)}
            containerClassName="space-y-2"
          />
          <DateField
            label="Tanggal Masuk"
            defaultDate={data?.join_date || ''}
            disabled={!isEditing}
            onChange={(_dates, dateStr) => handleInputChange('join_date', dateStr)}
            containerClassName="space-y-2"
          />
          <DateField
            label="Tanggal Berakhir"
            defaultDate={data?.end_date || ''}
            disabled={!isEditing}
            onChange={(_dates, dateStr) => handleInputChange('end_date', dateStr)}
            containerClassName="space-y-2"
          />
        </div>

        {/* Row 3: Sisa Kontrak, Status Perpanjangan, Jenis Kontrak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Sisa Kontrak"
            value={data?.remaining_contract || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('remaining_contract', e.target.value)}
            containerClassName="space-y-2"
          />
          <SelectField
            label="Status Perpanjangan"
            defaultValue={data?.renewal_status_name || ''}
            // disabled={!isEditing}
            onChange={(value) => handleInputChange('renewal_status_name', value)}
            containerClassName="space-y-2"
            options={
              statusOptions.length > 0
                ? statusOptions
                : [
                    { label: 'Diperpanjang Tetap', value: 'Diperpanjang Tetap' },
                    { label: 'Diperpanjang Berubah', value: 'Diperpanjang Berubah' },
                    { label: 'Sedang di Proses', value: 'Sedang di Proses' },
                    { label: 'Menunggu diproses', value: 'Menunggu diproses' },
                    { label: 'Ditolak', value: 'Ditolak' },
                  ]
            }
          />
          {!showLimitedFields && shouldShowAllDetailFields() && (
            <SelectField
              label="Jenis Kontrak"
              defaultValue={data?.contract_type_name || ''}
              disabled={!isEditing}
              onChange={(value) => handleInputChange('contract_type_name', value)}
              containerClassName="space-y-2"
              options={
                contractTypeOptions.length > 0
                  ? contractTypeOptions
                  : [
                      { label: 'Pilih Jenis Kontrak', value: '' },
                      { label: 'Kontrak Tetap', value: 'Kontrak Tetap' },
                      { label: 'Kontrak Sementara', value: 'Kontrak Sementara' },
                      { label: 'PKWT', value: 'PKWT' },
                    ]
              }
            />
          )}
        </div>

        {/* Row 4: Kontrak Ke, Tanggal TTD Kontrak Baru, Tanggal Berakhir Kontrak Baru */}
        {!showLimitedFields && shouldShowAllDetailFields() && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Kontrak Ke"
              type="number"
              value={data?.contract_number || ''}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('contract_number', e.target.value)}
              containerClassName="space-y-2"
            />
            <DateField
              label="Tanggal TTD Kontrak Baru"
              defaultDate={data?.new_contract_date || ''}
              // disabled={!isEditing}
              onChange={(_dates, dateStr) => handleInputChange('new_contract_date', dateStr)}
              containerClassName="space-y-2"
            />
            <DateField
              label="Tanggal Berakhir Kontrak Baru"
              defaultDate={data?.new_contract_end_date || ''}
              // disabled={!isEditing}
              onChange={(_dates, dateStr) => handleInputChange('new_contract_end_date', dateStr)}
              containerClassName="space-y-2"
            />
          </div>
        )}

        {/* Row 5: Dokumen Kontrak, Dokumen Evaluasi */}
        {!showLimitedFields && shouldShowAllDetailFields() && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileField
                label="Dokumen Kontrak"
                // disabled={!isEditing}
                onChange={(e) => handleInputChange('contract_document', e.target.files?.[0])}
                containerClassName="space-y-2"
                // accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <FileField
                label="Dokumen Evaluasi"
                // disabled={!isEditing}
                onChange={(e) => handleInputChange('evaluation_document', e.target.files?.[0])}
                containerClassName="space-y-2"
                // accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        )}

        {/* Row 6: Catatan */}
        <div>
          <TextAreaField
            label="Catatan"
            value={data?.notes || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('notes', value)}
            containerClassName="space-y-2"
            rows={4}
          />
        </div>

      </div>
    </PayrollCard>
  );
}
