import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { useStoryPayrollTab } from '@/features/employee/hooks/tab/useStoryPayrollTab';
interface Props { employeeId?: string; isEditable: boolean }
export default function StoryPayrollTab({ isEditable }: Props) {
  const { title, message } = useStoryPayrollTab(isEditable);
  return (
    <ExpandCard title={title} withHeaderDivider>
      <div className="text-sm text-gray-500">{message}</div>
    </ExpandCard>
  );
}
