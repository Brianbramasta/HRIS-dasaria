export interface RefDeductionListItem {
  id: string;
  referenceName: string;
  category: string;
  nominalValue: number;
  description: string;
}

export interface RefDeductionDetailResponse {
  id: string;
  referenceName: string;
  category: string;
  nominalValue: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefDeductionUpdatePayload {
  nominalValue: number;
  description: string;
}
