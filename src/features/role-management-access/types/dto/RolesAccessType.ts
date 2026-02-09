export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- Payload ---

export interface RoleAccessItemPayload {
  id: string | null;
  name: string;
  apps_id: string;
  accessIds: string[];
}

export interface CreateRoleAccessPayload {
  items: RoleAccessItemPayload[];
}

// --- Get Roles Access (Hierarchy) ---

export interface AccessItem {
  access_id: string;
  access_name: string;
}

export interface FeatureItem {
  features_id: string;
  features_name: string;
  list_access: AccessItem[];
}

export interface ModuleItem {
  modules_id: string;
  modules_name: string;
  features: FeatureItem[];
}

export interface AppRoleAccessItem {
  app_id: string;
  app_name: string;
  list_modules: ModuleItem[];
}

// --- List Apps Per Role ---

export interface AppItem {
  app_id: string;
  app_name: string;
}

export interface RoleAppItem {
  role_id: string;
  role_name: string;
  list_apps: AppItem[];
}
