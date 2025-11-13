import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import type { Karyawan } from '@/features/staff/types/Karyawan';

interface Props {
  data?: Karyawan;
  isEditable?: boolean;
}

export default function OrganizationHistoryTab(_: Props) {
  return (
    <ExpandCard title="Organization History" withHeaderDivider>
      <div className="text-sm text-gray-500">Belum ada riwayat organisasi.</div>
    </ExpandCard>
  );
}