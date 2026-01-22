export interface TransportationAllowanceListItem {
  id: string;
  nameTransportation: string;
  categoryId: string;
  categoryName: string;
  nominalValue: number;
}

export interface TransportationAllowanceDetailResponse {
  id: string;
  nameTransportation: string;
  categoryName: string;
  nominalValue: number;
}

export interface TransportationAllowanceUpdatePayload {
  nominalValue: number;
}
