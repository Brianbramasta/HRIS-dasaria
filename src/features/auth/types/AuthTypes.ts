// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  type: string;
  expires_in: number;
  account: {
    id: string;
    employee_nip: string;
    email: string;
    created_at: string | null;
    updated_at: string | null;
  
  };
  employee: {
    id: string;
    employee_nip: string;
    email: string;
    created_at: string | null;
    updated_at: string | null;
      account_roles: {
      account_id: string;
      role_id: string;
      role: {
        id: string;
        name_role: string;
        created_at: string | null;
        updated_at: string | null;
      };
    }[];
    employee: {
      id: string;
      full_name: string;
      avatar: string;
      national_id: number;
      email: string;
      religion: string | null;
      religion_id: string;
      blood_type: string;
      birth_place: string;
      birth_date: string;
      gender: string;
      phone_number: string;
      current_address: string;
      ktp_address: string;
      // Add other fields as necessary
    };
    employee_positions: any; // Use any or detailed type if needed
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  meta: {
    message: string;
    status: number;
  };
  resetToken?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}