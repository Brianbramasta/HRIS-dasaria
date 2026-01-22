export interface BpjsItemListItem {
  id: string;
  detailName: string;
  category: string;
  type: string;
  companyPercentage: number;
}

export interface BpjsItemApiItem {
  id: string;
  detail_name: string;
  category: string;
  type: string;
  company_percentage: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface BpjsItemDetailResponse {
  id: string;
  detailName: string;
  category: string;
  type: string;
  companyPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface BpjsItemUpdatePayload {
  companyPercentage: number;
  employeePercentage?: number;
}

export interface BpjsListGroupedItem {
  id: string;
  detail_name: string;
  type: string;
}

export interface BpjsListGrouped {
  [category: string]: BpjsListGroupedItem[];
}
