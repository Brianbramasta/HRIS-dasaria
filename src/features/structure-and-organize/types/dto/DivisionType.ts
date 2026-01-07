import { FileSummary } from './SharedType';

export interface DivisionListItem {
  id: string;
  name: string;
  description: string | null;
  directorateId: string | null;
  directorateName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface DivisionDropdown {
  id: string;
  division_name: string;
}
