import React from 'react';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import type { Karyawan } from '@/features/staff/types/Karyawan';

interface Props {
  data?: Karyawan;
  isEditable?: boolean;
}

export default function StoryPayrollTab(_: Props) {
  return (
    <ExpandCard title="Story Payroll" withHeaderDivider>
      <div className="text-sm text-gray-500">Belum ada histori payroll.</div>
    </ExpandCard>
  );
}