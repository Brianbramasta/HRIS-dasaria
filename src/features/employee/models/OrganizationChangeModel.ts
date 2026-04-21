import { 
  OrganizationChangeListItem, 
  OrganizationChangeDetail, 
  PositionDetail,
  NonFixAllowanceItem,
  EmployeeOrganizationChangeHistory 
} from '../types/dto/OrganizationChangeType';
import { 
  OrganizationChangeEntity, 
  OrganizationChangeDetailEntity,
  PositionDetailEntity,
  NonFixAllowanceItemEntity,
  EmployeeOrganizationChangeHistoryEntity
} from '../types/entity/OrganizationChangeEntity';

/**
 * Model layer for transforming API data to internal application format
 * Following clean architecture principles - this is the ONLY place where API transformation happens
 */

export class OrganizationChangeModel {
  /**
   * Transform API response data to Entity interface
   * @param dto - Raw data from API (OrganizationChangeListItem)
   * @returns Transformed data in internal Entity format
   */
  static transformFromApi(dto: OrganizationChangeListItem): OrganizationChangeEntity {
    return {
      id: dto.id,
      employee_id: dto.employee_id,
      employee_name: dto.employee_name,
      change_type_name: dto.change_type_name,
      effective_date: dto.effective_date,
      status: dto.org_change_status,
      category: dto.category,
      org_change_status: dto.org_change_status, // API compatibility
      status_perubahan: dto.org_change_status, // For UI compatibility
    };
  }

  /**
   * Transform API detail data to Entity interface
   * @param dto - Raw detail data from API (OrganizationChangeDetail)
   * @returns Transformed data in internal Entity format
   */
  static transformDetailFromApi(dto: OrganizationChangeDetail): OrganizationChangeDetailEntity {
    return {
      id: dto.id,
      org_change_status: dto.org_change_status ?? null,
      employee_id: dto.employee_id,
      employee_name: dto.employee_name,
      marital_status: dto.marital_status,
      dependents: dto.dependents,
      reason_change: dto.reason_change,
      change_type_name: dto.change_type_name,
      decree_file: dto.decree_file,
      adendum_file: dto.adendum_file,
      previous_position: this.transformPositionFromApi(dto.previous_position),
      new_position: this.transformPositionFromApi(dto.new_position),
      recommended_by: dto.recommended_by,
      created_by: dto.created_by,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
    };
  }

  /**
   * Transform position detail from API to Entity
   * @param dto - Raw position data from API
   * @returns Transformed position data in Entity format
   */
  static transformPositionFromApi(dto: PositionDetail): PositionDetailEntity {
    return {
      employee_category: dto.employee_category,
      employee_category_id: dto.employee_category_id,
      company: dto.company,
      company_id: dto.company_id,
      office: dto.office,
      office_id: dto.office_id,
      directorate: dto.directorate,
      directorate_id: dto.directorate_id,
      division: dto.division,
      division_id: dto.division_id,
      department: dto.department,
      department_id: dto.department_id,
      unit: dto.unit,
      unit_id: dto.unit_id,
      position: dto.position,
      position_id: dto.position_id,
      rank_position: dto.rank_position,
      rank_position_id: dto.rank_position_id,
      structural_position: dto.structural_position,
      structural_position_id: dto.structural_position_id,
      position_level: dto.position_level,
      position_level_id: dto.position_level_id,
      base_salary: dto.gaji_pokok,
      marriage_allowance: dto.tunjangan_pernikahan,
      position_allowance: dto.tunjangan_jabatan,
      tenure_allowance: dto.tunjangan_lama_kerja,
      grade: dto.grade,
      non_fix_allowance: dto.tunjangan_dekresi.map(item => this.transformNonFixAllowanceFromApi(item)),
      take_home_pay: dto.take_home_pay,
      effective_date: dto.effective_date,
    };
  }

  /**
   * Transform non-fix allowance from API to Entity
   * @param dto - Raw non-fix allowance data from API
   * @returns Transformed non-fix allowance data in Entity format
   */
  static transformNonFixAllowanceFromApi(dto: NonFixAllowanceItem): NonFixAllowanceItemEntity {
    return {
      id: dto.id,
      amount: dto.amount,
      allowance_name: dto.allowance_name,
    };
  }

  /**
   * Transform employee organization change history from API to Entity
   * @param dto - Raw employee organization change history data from API
   * @returns Transformed data in Entity format
   */
  static transformEmployeeHistoryFromApi(dto: EmployeeOrganizationChangeHistory): EmployeeOrganizationChangeHistoryEntity {
    return {
      id: dto.id,
      employee_id: dto.employee_id,
      employee_name: dto.employee_name,
      change_type_name: dto.change_type_name,
      effective_date: dto.effective_date,
      status: dto.org_change_status,
      category: dto.category,
    };
  }

  /**
   * Transform array of API data to array of Entity
   * @param dtoList - Array of raw data from API
   * @returns Array of transformed data in internal Entity format
   */
  static transformListFromApi(dtoList: OrganizationChangeListItem[]): OrganizationChangeEntity[] {
    return dtoList.map(item => this.transformFromApi(item));
  }

  /**
   * Transform array of employee history API data to array of Entity
   * @param dtoList - Array of raw employee history data from API
   * @returns Array of transformed data in internal Entity format
   */
  static transformEmployeeHistoryListFromApi(dtoList: EmployeeOrganizationChangeHistory[]): EmployeeOrganizationChangeHistoryEntity[] {
    return dtoList.map(item => this.transformEmployeeHistoryFromApi(item));
  }
}
