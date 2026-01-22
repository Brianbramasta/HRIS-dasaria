import { useMemo, useEffect, useState } from 'react';
import { PositionAllowanceDetailResponse, PositionAllowanceUpdatePayload, BpjsItemDetail } from '@/features/payroll/types/dto/fixed-allowance/PositionAllowanceType';
import { formatInputCurrency } from '@/utils/formatCurrency';

export type BpjsRow = { 
  id: string; 
  jenisBpjs: string; 
  selected: boolean; 
  tunjanganId?: string;
  potonganId?: string;
  tt: boolean;
  pt: boolean;
};

type FormValues = {
  jobLevelId: string;
  jabatan: string;
  percent: string;
  nominal: string;
  ketenagakerjaan: BpjsRow[];
  kesehatan: BpjsRow[];
};

type FormErrors = {
  percent?: string;
  nominal?: string;
};

export function useEditPositionAndBPJSAllowanceModal(args: {
  defaultValues?: PositionAllowanceDetailResponse | null;
  onSave?: (values: PositionAllowanceUpdatePayload) => void;
  onClose: () => void;
  mode?: 'detail' | 'edit';
}) {
  const { defaultValues, onSave, onClose } = args;

  const jabatanOptions = useMemo(
    () => [
      { value: 'Entry Level', label: 'Entry Level' },
      { value: 'Officer', label: 'Officer' },
      { value: 'Senior Officer', label: 'Senior Officer' },
      { value: 'Supervisor', label: 'Supervisor' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Direktur', label: 'Direktur' },
    ],
    [],
  );

  const mapBpjsItems = (items: BpjsItemDetail[]): BpjsRow[] => {
    const grouped: Record<string, BpjsRow> = {};
    
    items.forEach(item => {
        const key = item.detailName;
        if (!grouped[key]) {
            grouped[key] = {
                id: key, 
                jenisBpjs: key,
                selected: false,
                tt: false,
                pt: false,
            };
        }
        
        if (item.type === 'Tunjangan') {
            grouped[key].tunjanganId = item.id;
            grouped[key].tt = item.isActive === 1;
        } else if (item.type === 'Potongan') {
            grouped[key].potonganId = item.id;
            grouped[key].pt = item.isActive === 1;
        }
    });

    return Object.values(grouped).map(row => {
        // Logic: Jika Potongan (pt) aktif, maka Tunjangan (tt) juga harus aktif
        if (row.pt) {
            row.tt = true;
        }

        const hasTunjangan = !!row.tunjanganId;
        const hasPotongan = !!row.potonganId;
        
        let isSelected = false;
        if (hasTunjangan && hasPotongan) {
            isSelected = row.tt && row.pt;
        } else if (hasTunjangan) {
            isSelected = row.tt;
        } else if (hasPotongan) {
            isSelected = row.pt;
        }
        
        return { ...row, selected: isSelected };
    });
  };

  const [form, setForm] = useState<FormValues>({
      jobLevelId: '',
      jabatan: '',
      percent: '',
      nominal: '',
      ketenagakerjaan: [],
      kesehatan: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (defaultValues) {
        setForm({
            jobLevelId: defaultValues.fixed_allowance.job_title_id,
            jabatan: defaultValues.fixed_allowance.job_title_name,
            percent: defaultValues.fixed_allowance.percentage_value != null ? String(defaultValues.fixed_allowance.percentage_value) : '',
            nominal: defaultValues.fixed_allowance.nominal_value != null ? formatInputCurrency(String(defaultValues.fixed_allowance.nominal_value)) : '',
            ketenagakerjaan: mapBpjsItems(defaultValues.bpjs_items['BPJS Ketenagakerjaan'] || []),
            kesehatan: mapBpjsItems(defaultValues.bpjs_items['BPJS Kesehatan'] || []),
        });
    }
  }, [defaultValues]);

  const setField = (key: keyof FormValues, value: any) => {
    setForm((prev) => {
      const updates: any = {};
      
      if (key === 'percent') {
        const numericValue = value.replace(/[^0-9.]/g, '');
        updates.percent = numericValue;
        if (numericValue) updates.nominal = '';
      } else if (key === 'nominal') {
        updates.nominal = formatInputCurrency(String(value));
        if (value) updates.percent = '';
      } else {
        updates[key] = value;
      }

      // Clear errors
      if (key === 'percent' || key === 'nominal') {
        setErrors((prev) => ({ ...prev, percent: undefined, nominal: undefined }));
      }

      return { ...prev, ...updates };
    });
  };

  const updateBpjs = (group: 'ketenagakerjaan' | 'kesehatan', id: string, field: keyof BpjsRow, value: boolean) => {
    setForm((prev) => {
        const rows = prev[group].map((r) => {
            if (r.id !== id) return r;
            
            const newRow = { ...r };
            
            if (field === 'selected') {
                newRow.selected = value;
                if (newRow.tunjanganId) newRow.tt = value;
                if (newRow.potonganId) newRow.pt = value;
            } else if (field === 'tt') {
                newRow.tt = value;
            } else if (field === 'pt') {
                newRow.pt = value;
            }

            // Recalculate selected for tt/pt changes
            if (field === 'tt' || field === 'pt') {
                const hasTunjangan = !!newRow.tunjanganId;
                const hasPotongan = !!newRow.potonganId;
                if (hasTunjangan && hasPotongan) {
                    newRow.selected = newRow.tt && newRow.pt;
                } else if (hasTunjangan) {
                    newRow.selected = newRow.tt;
                } else if (hasPotongan) {
                    newRow.selected = newRow.pt;
                }
            }

            return newRow;
        });
        return { ...prev, [group]: rows };
    });
  };

  const handleSubmit = () => {
    // Validation: at least one of percent or nominal must be filled
    if (!form.percent && !form.nominal) {
        setErrors({
            percent: 'Salah satu harus diisi',
            nominal: 'Salah satu harus diisi'
        });
        return;
    }

    if (onSave) {
        const flatten = (rows: BpjsRow[]) => {
            const result: { bpjs_item_id: string; is_active: 0 | 1 }[] = [];
            rows.forEach(r => {
                if (r.tunjanganId) {
                    result.push({ bpjs_item_id: r.tunjanganId, is_active: r.tt ? 1 : 0 });
                }
                if (r.potonganId) {
                    result.push({ bpjs_item_id: r.potonganId, is_active: r.pt ? 1 : 0 });
                }
            });
            return result;
        };

        const payload: PositionAllowanceUpdatePayload = {
            jobLevelId: form.jobLevelId,
            percentage_value: form.percent ? Number(form.percent.replace(/[^0-9.]/g, '')) : null,
            nominal_value: form.nominal ? Number(form.nominal.replace(/[^0-9]/g, '')) : null,
            positionAllowanceBpjs: [
                ...flatten(form.ketenagakerjaan),
                ...flatten(form.kesehatan)
            ]
        };
        onSave(payload);
    }
    onClose();
  };

  return { form, setField, updateBpjs, jabatanOptions, handleSubmit, errors };
}
