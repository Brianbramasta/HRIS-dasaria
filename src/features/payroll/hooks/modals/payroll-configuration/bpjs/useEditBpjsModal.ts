import { useEffect, useMemo, useState } from 'react';
import { useApiBpjsItem } from '../../../api/useApiBpjsItem';
import { BpjsItemListItem } from '@/features/payroll/types/dto/BpjsItemType';

export type BpjsFormValues = {
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
};

interface UseEditBpjsModalParams {
  isOpen: boolean;
  defaultValues?: BpjsItemListItem | null;
  onSuccess: () => void;
  onClose?: () => void;
}

export const useEditBpjsModal = ({
  isOpen,
  defaultValues,
  onSuccess,
}: UseEditBpjsModalParams) => {
  const { updateBpjsItem, getBpjsItemDetail, loading } = useApiBpjsItem();
  
  const initial: BpjsFormValues = useMemo(
    () => ({
      detailBpjs: defaultValues?.detailName ?? '',
      kategoriBpjs: defaultValues?.category ?? '',
      jenis: defaultValues?.type ?? '',
      percent: defaultValues?.companyPercentage?.toString() ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<BpjsFormValues>(initial);

  // Effect untuk set initial form dari defaultValues saat modal dibuka
  useEffect(() => {
    if (isOpen && defaultValues) {
      setForm({
        detailBpjs: defaultValues.detailName,
        kategoriBpjs: defaultValues.category,
        jenis: defaultValues.type,
        percent: defaultValues.companyPercentage.toString(),
      });
    } else if (!isOpen) {
      setForm(initial); // Reset saat tutup
    }
  }, [isOpen, defaultValues, initial]);

  // Effect untuk fetch detail terbaru dari API
  useEffect(() => {
    const fetchDetail = async () => {
      if (isOpen && defaultValues?.id) {
        const detail = await getBpjsItemDetail(defaultValues.id);
        if (detail) {
          setForm((prev) => ({
            ...prev,
            detailBpjs: detail.detailName,
            kategoriBpjs: detail.category,
            jenis: detail.type,
            percent: detail.companyPercentage.toString(),
          }));
        }
      }
    };

    fetchDetail();
  }, [isOpen, defaultValues?.id, getBpjsItemDetail]);

  const setField = (key: keyof BpjsFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!defaultValues?.id) return;

    const companyPercentage = parseFloat(form.percent);
    if (isNaN(companyPercentage)) {
      console.error('Percentage must be a number');
      return;
    }

    const result = await updateBpjsItem(defaultValues.id, {
      companyPercentage,
    });

    if (result) {
       onSuccess();
    }
  };

  return { form, setField, handleSubmit, loading };
};
