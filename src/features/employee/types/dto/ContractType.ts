export type ContractEntry = {
  id?: string;
  full_name: string;
  contract_status: string;
  // contract_status_name?: string;
  last_contract_signed_date: string;
  end_date: string;
  contract_type_id: string;
  contract_type_name?: string;
  contract_number: number;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
  deskripsi?: string;
  fileName?: string;
  file_contract?: string;
  note?: string;
  file_for_resign?: string;
  dokumenBerakhir?: string;
  lama_bekerja?: string;
  sisa_kontrak?: string;
};

export interface DropdownOption {
  label: string;
  value: string;
}

// edit
// /api/employee-master-data/employees/{id}/update-contract/{contractId}
export interface UpdateContractPayload extends FormData {
  contract_status_id?: string;
  contract_end_status_id?: string;
  note_for_resign?: string;
  file_for_resign?: File;
}

// Response Types
export interface ContractSummary {
  status_kontrak: string;
  ttd_kontrak_terakhir: string;
  berakhir_kontrak: string;
  jenis_kontrak: string;
  lama_bekerja: string;
  sisa_kontrak: string;
  kontrak_ke: number;
  status_berakhir: string;
  kontrak_aktif?: string;
  contract_status_id?: string;
  contract_status_name?: string;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
}

export interface ContractHistoryItem {
  id: string;
  employee_id: string;
  contract_number: string;
  contract_type: string;
  contract_status: string;
  last_contract_signed_date: string;
  end_date: string;
  file_contract: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ContractData {
  summary: ContractSummary;
  contracts: ContractHistoryItem[];
}

// Request Types
export interface CreateContractPayload {
  contract_status?: string; // 1=active, 2=inactive, 3=probation, 4=resigned
  contract_status_id?: string; // 1=active, 2=inactive, 3=probation, 4=resigned
  last_contract_signed_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  contract_type_id: string; // 1=PKWT, 2=PKWTT
  contract_number: string;
  file_contract: File;
}

export interface CreateContractResponse {
  employee_id: string;
  contract_status: number;
  last_contract_signed_date: string;
  end_date: string;
  contract_type: number;
  contract_number: string;
  file_contract: string;
  id: string;
  updated_at: string;
  created_at: string;
}

export interface ContractStatusDropdownItem {
    id_status: string;
    status_name: string;
}
