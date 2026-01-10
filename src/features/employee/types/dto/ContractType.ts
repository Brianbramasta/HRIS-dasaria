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
