export interface ConfigurationTHRListItem {
  id: string;
  lengthOfService: string;
  description: string;
}

export interface ConfigurationTHRDetailResponse {
  id: string;
  lengthOfService: string;
  description: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ConfigurationTHRUpdatePayload {
  lengthOfService: string;
  description?: string;
}

export interface ConfigurationTHRUpdateStatusPayload {
  isActive: boolean;
}
