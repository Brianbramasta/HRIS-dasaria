import { FileSummary } from '../../../../types/SharedType';

export interface DepartmentListItem {
  id: string;
  name: string;
  description: string | null;
  divisionId: string | null;
  divisionName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}
