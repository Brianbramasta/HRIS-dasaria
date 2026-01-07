import { FileSummary } from './SharedType';

export interface BusinessLineListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface BusinessLineApiItem {
  uuid_lini_bisnis: string;
  nama_lini_bisnis: string;
  deskripsi_lini_bisnis: string | null;
  no_sk_lini_bisnis: string | null;
  file_url_sk_lini_bisnis: string | null;
  no_sk_hapus_lini_bisnis: string | null;
  file_url_sk_hapus_lini_bisnis: string | null;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BusinessLineDetailResponse {
  businessLine: {
    id: string;
    name: string;
    description: string | null;
    memoNumber: string | null;
    skFile: FileSummary | null;
  };
  personalFiles: FileSummary[];
  companies: { id: string; name: string; details: string | null }[];
}
