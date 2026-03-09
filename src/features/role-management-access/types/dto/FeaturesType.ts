export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface FeatureItem {
  id: string;
  name: string;
  modules_id: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureListResponse {
  current_page: number;
  data: FeatureItem[];
  per_page: number;
  to: number;
  total: number;
}

// --- Detail ---
export interface FeatureAccessItem {
  id: string;
  name: string;
  code: string;
  describe: string;
  features_id: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureDetailResult {
  id: string;
  name: string;
  modules_id: string;
  created_at: string;
  updated_at: string;
  access: FeatureAccessItem[];
}

// --- Payloads ---
export interface CreateFeaturePayload {
  modules_id: string;
  name: string[];
}

export interface UpdateFeaturePayload {
  name: string;
}
