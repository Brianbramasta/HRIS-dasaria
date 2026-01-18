import { formatCurrency } from '@/utils/formatCurrency';

export type PayrollDetailItem = {
  label: string;
  amount: number;
};

export type PayrollDetailVariant = 'gaji_pokok' | 'tunjangan_tetap' | 'potongan_tetap' | 'tunjangan_tidak_tetap';

type Props = {
  title: string;
  variant: PayrollDetailVariant;
  items: PayrollDetailItem[];
};

export default function PayrollDetailCard({ title, variant, items }: Props) {
  const headerClassName =
    variant === 'gaji_pokok'
      ? 'bg-slate-600'
      : variant === 'potongan_tetap'
        ? 'bg-red-600'
        : 'bg-emerald-600';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className={`${headerClassName} px-4 py-2 text-sm font-semibold text-white`} style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>{title}</div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-3 text-sm text-gray-800 dark:text-white border-0"
          >
            <span>{item.label}</span>
            <span className="font-semibold">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

