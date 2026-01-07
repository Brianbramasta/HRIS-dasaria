import { FileSummary } from './SharedType';

export interface CompanyListItem {
  id: string;
  name: string;
  description: string | null;
  businessLineId: string | null;
  businessLineName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
  logo: string | FileSummary | null;
}

export interface CompanyDetailResponse {
  company: {
    id: string;
    name: string;
    logo: string | FileSummary | null;
    businessLineId: string | null;
    businessLineName: string | null;
    description: string | null;
    address: string | null;
    employeeCount: number | null;
    postalCode: string | null;
    email: string | null;
    phone: string | null;
    industry: string | null;
    founded: string | number | null;
    type: string | null;
    website: string | null;
    createdAt: string | null;
    memoNumber: string | null;
    skFile: FileSummary | null;
  };
  branches: { id: string; name: string; address: string | null; employeeCount: number | null }[];
  documents: FileSummary[];
}
