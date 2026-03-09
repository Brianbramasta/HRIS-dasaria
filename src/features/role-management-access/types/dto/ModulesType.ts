export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface ModuleListItem {
  id: string;
  name: string;
  apps_id: string;
  apps_code: string;
  apps_name: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleListResponse {
  current_page: number;
  data: ModuleListItem[];
  per_page: number;
  to: number;
  total: number;
}

// --- Detail ---
export interface FeatureItem {
  id: string;
  name: string;
  modules_id: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleDetailResult {
  id: string;
  name: string;
  apps_id: string;
  apps_code: string;
  apps_name: string;
  created_at: string;
  updated_at: string;
  features: FeatureItem[];
}

// --- Payloads ---
export interface CreateModulePayload {
  apps_id: string;
  name: string[];
}

export interface UpdateModulePayload {
  name: string;
}
