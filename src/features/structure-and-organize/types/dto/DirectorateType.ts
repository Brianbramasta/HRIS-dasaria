import { FileSummary } from '../../../../types/SharedType';

export interface DirectorateListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface DirectorateDropdown {
  id: string;
  directorate_name: string;
}
