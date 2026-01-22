export interface DeductionListItem {
  id: string;
  deductionName: string;
  category: string; // e.g., "notfixed"
  description: string | null;
}

export interface DeductionDetailResponse {
  id: string;
  deductionName: string;
  category: string;
  description: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeductionCreatePayload {
  deductionName: string;
  category: string;
  description: string;
}

export interface DeductionUpdatePayload {
  deductionName: string;
  category: string;
  description: string;
}
