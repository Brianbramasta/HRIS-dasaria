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
  fixedAllowance: {
    id: string;
    jobTitleId: string;
    jobTitleName: string;
  };
  bpjsItems: Record<string, BpjsItemDetail[]>;
}

export interface PositionAllowanceBpjsUpdateItem {
  bpjs_item_id: string;
  is_active: 0 | 1;
}

export interface PositionAllowanceUpdatePayload {
  jobLevelId: string;
  percentageValue?: number;
  nominalValue?: number;
  positionAllowanceBpjs: PositionAllowanceBpjsUpdateItem[];
}
