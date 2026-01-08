import { useMemo } from 'react';

export function useSlipPayrollModal({
  data,
  title,
  takeHomePayLabel,
}: {
  data?: any;
  title?: string;
  takeHomePayLabel?: string;
}) {
  const totalPenerimaan = useMemo(() => {
    if (!data?.penerimaan) return 0;
    return Object.values(data.penerimaan).reduce((sum: number, val: any) => sum + (val || 0), 0);
  }, [data?.penerimaan]);

  const totalPotongan = useMemo(() => {
    if (!data?.potongan) return 0;
    return Object.values(data.potongan).reduce((sum: number, val: any) => sum + (val || 0), 0);
  }, [data?.potongan]);

  const takeHomePay = data?.takeHomePay ?? totalPenerimaan - totalPotongan;

  const resolvedTitle =
    title || `Slip Gaji ${new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;

  const resolvedTakeHomePayLabel = takeHomePayLabel || 'Take Home Pay';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  return {
    totalPenerimaan,
    totalPotongan,
    takeHomePay,
    resolvedTitle,
    resolvedTakeHomePayLabel,
    formatCurrency,
  };
}

