export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface AccessListItem {
  id: string;
  name: string;
  code: string;
  describe: string;
  features_id: string;
  feature_name: string;
  module_id: string;
  module_name: string;
  app_id: string;
  app_name: string;
  created_at: string;
  updated_at: string;
}

export interface AccessListResponse {
  current_page: number;
  data: AccessListItem[];
  per_page: number;
  to: number;
  total: number;
}

// --- Detail ---
export interface AccessDetailResult extends AccessListItem {}

// --- Payloads ---
export interface CreateAccessItem {
  name: string;
  describe: string;
}

export interface CreateAccessPayload {
  features_id: string;
  items: CreateAccessItem[];
}

export interface UpdateAccessPayload {
  name: string;
  describe: string;
}
