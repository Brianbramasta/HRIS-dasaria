export interface PositionAllowanceListItem {
  id: string;
  jobTitleName: string;
  percentageValue: number;
  nominalValue: number | null;
}

export interface BpjsItemDetail {
  id: string;
  detailName: string;
  type: string;
  isActive: number;
}

export interface PositionAllowanceDetailResponse {
  fixed_allowance: {
    id: string;
    job_title_id: string;
    job_title_name: string;
    percentage_value: number | null;
    nominal_value: number | null;
  };
  bpjs_items: Record<string, BpjsItemDetail[]>;
}

export interface PositionAllowanceBpjsUpdateItem {
  bpjs_item_id: string;
  is_active: 0 | 1;
}

export interface PositionAllowanceUpdatePayload {
  jobLevelId: string;
  percentage_value?: number | null;
  nominal_value?: number | null;
  positionAllowanceBpjs: PositionAllowanceBpjsUpdateItem[];
}
