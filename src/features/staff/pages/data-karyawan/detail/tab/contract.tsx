import React from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import type { Karyawan } from '@/features/staff/types/Karyawan';

interface Props {
  data?: Karyawan;
  isEditable?: boolean;
}

export default function ContractTab(_: Props) {
  return (
    <ExpandCard title="Contract" withHeaderDivider>
      <div className="text-sm text-gray-500">Belum ada data kontrak.</div>
    </ExpandCard>
  );
}