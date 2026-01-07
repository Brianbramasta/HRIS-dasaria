import { FileSummary } from '../../../../types/SharedType';

export interface PositionListItem {
  id: string;
  name: string;
  grade: string | null;
  jobDescription: string | null;
  directSubordinates: string[];
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface EmployeePositionListItem {
  id: string;
  name: string;
  positionId: string | null;
  positionName: string | null;
  directorateId: string | null;
  directorateName: string | null;
  divisionId: string | null;
  divisionName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  // Dokumentasi: tambahkan field deskripsi mengikuti mapping service
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}
