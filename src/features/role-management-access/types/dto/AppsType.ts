export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface AppListItem {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AppListResponse {
  current_page: number;
  data: AppListItem[];
  per_page: number;
  to: number;
  total: number;
}

// --- Detail ---
export interface AccessDetail {
  access_id: string;
  access_name: string;
}

export interface FeatureDetail {
  features_id: string;
  features_name: string;
  list_access: AccessDetail[];
}

export interface ModuleDetail {
  modules_id: string;
  modules_name: string;
  features: FeatureDetail[];
}

export interface AppDetailResult {
  app_id: string;
  app_name: string;
  list_modules: ModuleDetail[];
}

// --- Payloads ---
export interface CreateAppPayload {
  name: string[];
}

export interface UpdateAppPayload {
  name: string;
}
