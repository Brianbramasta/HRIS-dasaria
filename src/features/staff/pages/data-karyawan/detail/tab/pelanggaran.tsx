import React from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import type { Karyawan } from '@/features/staff/types/Karyawan';

interface Props {
  data?: Karyawan;
  isEditable?: boolean;
}

export default function PelanggaranTab(_: Props) {
  return (
    <ExpandCard title="Pelanggaran" withHeaderDivider>
      <div className="text-sm text-gray-500">Tidak ada catatan pelanggaran.</div>
    </ExpandCard>
  );
}