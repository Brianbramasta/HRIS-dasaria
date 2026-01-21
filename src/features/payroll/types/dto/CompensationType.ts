export interface CompensationListItem {
  id: string;
  jobTitleName: string;
  structuralJobName: string;
  structuralJobs?: { id: string; structuralJobName: string }[];
  categoryCompensation: string;
  amountGeneral: number | null;
  amountJunior: number | null;
  amountMiddle: number | null;
  amountSenior: number | null;
}

export interface CompensationApiItem {
  id: string;
  job_title_name: string;
  mt_structural_job_name: string;
  category_compensation: string;
  amount_general: number | null;
  amount_junior: number | null;
  amount_middle: number | null;
  amount_senior: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompensationDetailResponse {
  id: string;
  jobTitle: {
    id: string;
    jobTitleName: string;
    structuralJobs: {
      id: string;
      structuralJobName: string;
    }[];
  };
  categoryCompensation: string;
  amountGeneral: number | null;
  amountJunior: number | null;
  amountMiddle: number | null;
  amountSenior: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompensationUpdatePayload {
  categoryCompensation: string;
  amountGeneral?: string | number | null;
  amountJunior?: string | number | null;
  amountMiddle?: string | number | null;
  amountSenior?: string | number | null;
}
