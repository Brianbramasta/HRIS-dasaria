export interface FeeListItem {
  id: string;
  name: string;
  amount: number;
}

export interface FeeDetailResponse {
  id: string;
  name: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface FeeUpdatePayload {
  amount: number;
}
