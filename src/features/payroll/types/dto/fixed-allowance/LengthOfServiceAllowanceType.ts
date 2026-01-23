export interface LengthOfServiceAllowanceListItem {
  id: string;
  lengthOfService: string;
  nominalValue: number;
}

export interface LengthOfServiceAllowanceApiItem {
  id: string;
  length_of_service: string;
  nominal_value: number;
  created_at?: string;
  updated_at?: string;
}

export interface LengthOfServiceAllowanceDetailResponse {
  id: string;
  lengthOfService: string;
  nominalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface LengthOfServiceAllowanceUpdatePayload {
  nominalValue: number;
}
