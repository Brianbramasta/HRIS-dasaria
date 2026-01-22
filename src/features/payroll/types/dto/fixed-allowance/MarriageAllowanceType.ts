export interface MarriageAllowanceListItem {
  id: string;
  code: string;
  category: string;
  dependents: number;
  nominalValue: number;
}

export interface MarriageAllowanceApiItem {
  id: string;
  code: string;
  category: string;
  dependents: number;
  nominal_value: number;
}

export interface MarriageAllowanceDetailResponse {
  id: string;
  code: string;
  category: string;
  dependents: number;
  nominalValue: number;
}

export interface MarriageAllowanceUpdatePayload {
  nominalValue: number;
}
