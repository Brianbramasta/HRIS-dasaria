import { 
  PayrollHistoryItemDTO, 
  PayrollHistoryResponseDTO,
  KasbonHistoryItemDTO,
  KasbonHistoryResponseDTO 
} from '../types/dto/PayrollHistoryDto';
import { 
  PayrollHistoryEntity, 
  PayrollHistoryListEntity,
  KasbonHistoryEntity,
  KasbonHistoryListEntity 
} from '../types/entity/PayrollHistoryEntity';

/**
 * Model layer for transforming Payroll & Kasbon History API data to internal application format
 * Following clean architecture principles - this is the ONLY place where API transformation happens
 */

export class PayrollHistoryModel {
  /**
   * Transform Payroll History DTO to Entity
   * @param dto - Raw payroll history data from API
   * @returns Transformed payroll history data in internal Entity format
   */
  static transformPayrollHistory(dto: PayrollHistoryItemDTO): PayrollHistoryEntity {
    return {
      id: dto.id,
      payrollMonth: dto.payroll_month,
      type: dto.type,
      netSalary: dto.net_salary,
    };
  }

  /**
   * Transform Kasbon History DTO to Entity
   * @param dto - Raw kasbon history data from API
   * @returns Transformed kasbon history data in internal Entity format
   */
  static transformKasbonHistory(dto: KasbonHistoryItemDTO): KasbonHistoryEntity {
    return {
      loanId: dto.loan_id,
      deductionStartPeriod: dto.deduction_start_period,
      deductionEndPeriod: dto.disbursed_at,
      nominalLoan: dto.nominal_loan ? parseFloat(dto.nominal_loan) : null,
      loanPeriod: dto.loan_period,
    };
  }

  /**
   * Transform Payroll History Response DTO to Entity List
   * @param dto - Payroll history response from API
   * @returns Transformed payroll history list in internal Entity format
   */
  static transformPayrollHistoryList(dto: PayrollHistoryResponseDTO): PayrollHistoryListEntity {
    // Handle case where data might be undefined or structure is different
    const dataArray = dto?.data || [];
    
    return {
      data: dataArray.map((item: PayrollHistoryItemDTO) => this.transformPayrollHistory(item)),
      currentPage: 1, // API doesn't return pagination info
      perPage: 10,
      total: dataArray.length,
    };
  }

  /**
   * Transform Kasbon History Response DTO to Entity List
   * @param dto - Kasbon history response from API
   * @returns Transformed kasbon history list in internal Entity format
   */
  static transformKasbonHistoryList(dto: KasbonHistoryResponseDTO): KasbonHistoryListEntity {
    // Handle case where data might be undefined or structure is different
    const dataArray = dto?.data || [];
    
    return {
      data: dataArray.map((item: KasbonHistoryItemDTO) => this.transformKasbonHistory(item)),
      currentPage: 1, // API doesn't return pagination info
      perPage: 10,
      total: dataArray.length,
    };
  }
}
