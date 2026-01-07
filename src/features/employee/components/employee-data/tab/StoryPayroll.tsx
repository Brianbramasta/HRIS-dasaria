import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
interface Props { employeeId?: string; isEditable: boolean }
export default function StoryPayrollTab({employeeId, isEditable }: Props) {
  return (
    <ExpandCard title={isEditable ? 'Story Payroll (Edit)' : 'Story Payroll'} withHeaderDivider>
      <div className="text-sm text-gray-500">Belum ada histori payroll.</div>
    </ExpandCard>
  );
}