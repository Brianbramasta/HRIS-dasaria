import { useEffect, useMemo, useState } from 'react';
import { useApiRefDeduction } from '../../../api/useApiRefDeduction';
import { RefDeductionListItem } from '@/features/payroll/types/dto/RefDeductionType';
import { formatCurrency, formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

export type DeductionReferenceForm = {
  acuanPotongan: string;
  kategori: string;
  nominal: string;
  keterangan: string;
};

export const useEditDeductionReferenceModal = (params: {
  isOpen: boolean;
  refDeductionData?: RefDeductionListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const { isOpen, refDeductionData, onSuccess, onClose } = params;
  const { updateRefDeduction, getRefDeductionDetail, loading: apiLoading } = useApiRefDeduction();
  const [detailLoading, setDetailLoading] = useState(false);

  const initial: DeductionReferenceForm = useMemo(
    () => ({
      acuanPotongan: refDeductionData?.referenceName ?? '',
      kategori: refDeductionData?.category ?? '',
      nominal: refDeductionData?.nominalValue ? formatCurrency(refDeductionData.nominalValue) : '',
      keterangan: refDeductionData?.description ?? '',
    }),
    [refDeductionData]
  );

  const [form, setForm] = useState<DeductionReferenceForm>(initial);

  useEffect(() => {
    // Reset to initial first when opening
    setForm(initial);

    // If modal is open and we have an ID, fetch the latest detail
    const fetchDetail = async () => {
      if (isOpen && refDeductionData?.id) {
        setDetailLoading(true);
        const detail = await getRefDeductionDetail(refDeductionData.id);
        if (detail) {
          setForm({
            acuanPotongan: detail.referenceName,
            kategori: detail.category,
            nominal: detail.nominalValue ? formatCurrency(detail.nominalValue) : '',
            keterangan: detail.description,
          });
        }
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, refDeductionData?.id, initial, getRefDeductionDetail]);

  const setField = (key: keyof DeductionReferenceForm, value: string) => {
    if (key === 'nominal') {
        const formatted = formatInputCurrency(value);
        setForm((prev) => ({ ...prev, [key]: formatted }));
    } else {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const kategoriOptions = [
    { value: 'BPJS Kesehatan', label: 'BPJS Kesehatan' },
    { value: 'BPJS Ketenagakerjaan', label: 'BPJS Ketenagakerjaan' },
  ];

  const handleSubmit = async () => {
    if (!refDeductionData?.id) return;

    const nominalValue = parseCurrency(form.nominal);

    await updateRefDeduction(refDeductionData.id, {
      nominalValue: nominalValue ?? 0,
      description: form.keterangan,
    });
    
    onSuccess();
    onClose();
  };

  return { form, setField, kategoriOptions, handleSubmit, loading: apiLoading || detailLoading };
};
