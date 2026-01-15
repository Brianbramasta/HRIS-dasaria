import { FileSummary } from '../../../../types/SharedType';

export interface UnitListItem {
  id: string;
  name: string;
  description: string | null;
  departmentId: string | null;
  departmentName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface UnitCreatePayload {
  name: string;
  departmentId: string;
  description?: string | null;
  memoNumber?: string | null;
  skFile?: File | null;
}

export interface UnitUpdatePayload {
  name?: string;
  departmentId?: string;
  description?: string | null;
  memoNumber?: string | null;
  skFile?: File | null;
}

export interface UnitDeletePayload {
  memoNumber: string;
  skFile?: File | null;
}
