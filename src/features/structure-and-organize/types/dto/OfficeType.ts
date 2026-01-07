import { FileSummary } from '../../../../types/SharedType';

export interface OfficeListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
  companyId?: string | null;
  companyIds?: string[];
}
