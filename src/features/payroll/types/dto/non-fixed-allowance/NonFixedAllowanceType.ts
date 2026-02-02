export interface NonFixedAllowanceListItem {
  id: string;
  allowanceName: string;
  categorySub: string;
  description: string;
}

export interface NonFixedAllowanceDetailResponse {
  id: string;
  allowanceName: string;
  categorySub: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface NonFixedAllowancePayload {
  allowanceName: string;
  categorySub: string;
  description: string;
}
