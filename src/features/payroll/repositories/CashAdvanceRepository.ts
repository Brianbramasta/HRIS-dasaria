import { 
    CashAdvanceEntity, 
    CashAdvanceDetailEntity, 
    CashAdvanceEmployeeInfoEntity,
    ActiveAndCompletedLoansEntity,
    CashAdvanceResponseEntity,
    CashAdvanceDetailResponseEntity,
    mapRawToCashAdvanceEntity,
    mapRawToActiveAndCompletedLoansEntity,
    mapToCashAdvanceDetailEntity,
    mapToCashAdvanceEmployeeInfoEntity,
    mapToCashAdvanceResponseEntity,
    mapCashAdvanceDetailDTOToEntity
} from '../models/CashAdvanceModel';
import { cashAdvanceServices } from '../services/CashAdvanceServices';
import { TableFilter } from '@/types/SharedType';

export interface CashAdvanceListResponse {
    data: CashAdvanceEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CashAdvanceRepository {
    // List operations
    getCashAdvances(filter?: Partial<TableFilter> & {
        columnFilters?: Record<string, string[]>;
        dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
    }): Promise<CashAdvanceListResponse>;
    getActiveAndCompletedLoans(employeeId?: string, filter?: Partial<TableFilter> & {
        columnFilters?: Record<string, string[]>;
        dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
    }): Promise<ActiveAndCompletedLoansEntity[]>;
    
    // Detail operations
    getCashAdvanceDetail(id: string): Promise<CashAdvanceDetailResponseEntity | null>;
    getEmployeeInfo(employeeId: string): Promise<CashAdvanceEmployeeInfoEntity | null>;
    
    // Action operations
    approveCashAdvance(id: string, status: 'Disetujui', deductionStartPeriod: string, disbursedAt: string): Promise<CashAdvanceResponseEntity | null>;
    rejectCashAdvance(id: string, status: 'Ditolak', rejectionReason: string): Promise<CashAdvanceResponseEntity | null>;
}

const toSortField = (field?: string): string => {
    const map: Record<string, string> = {
        employeeId: 'employee_id',
        fullName: 'full_name',
        applicationDate: 'application_date',
        nominalLoan: 'nominal_loan',
        loanStatusName: 'loan_status_name',
    };
    return map[field || ''] || field || 'application_date';
};

const buildFilterParams = (
    filter: Partial<TableFilter>,
    columnFilters?: Record<string, string[]>,
    dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>
): any => {
    const params: any = {
        page: filter.page || 1,
        per_page: filter.pageSize || 10,
    };

    if (filter.search) params.search = filter.search;
    if (filter.filter) params.status = filter.filter;
    
    if (filter.sortBy) {
        params.column = toSortField(filter.sortBy);
        if (filter.sortOrder) params.sort = filter.sortOrder;
    }

    // Add column filters - format: filter_column[column_name][in][]=value
    if (columnFilters) {
        Object.entries(columnFilters).forEach(([columnId, values]) => {
            if (values && values.length > 0) {
                values.forEach((value) => {
                    const key = `filter_column[${columnId}][in][]`;
                    if (!params[key]) {
                        params[key] = [];
                    }
                    params[key].push(value);
                });
            }
        });
    }

    // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
    if (dateRangeFilters) {
        Object.entries(dateRangeFilters).forEach(([columnId, dateRange]) => {
            if (dateRange && dateRange.startDate) {
                const key = `filter_column[${columnId}][range][]`;
                if (!params[key]) {
                    params[key] = [];
                }
                params[key].push(dateRange.startDate);
                if (dateRange.endDate) {
                    params[key].push(dateRange.endDate);
                }
            }
        });
    }

    return params;
};

export const cashAdvanceRepository: CashAdvanceRepository = {
    /**
     * Get cash advance list with pagination and filtering
     */
    async getCashAdvances(filter?: Partial<TableFilter> & {
                columnFilters?: Record<string, string[]>;
                dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
            }): Promise<CashAdvanceListResponse> {
        try {
            const effectiveFilter = filter || {};
            const params = buildFilterParams(
                effectiveFilter,
                effectiveFilter.columnFilters,
                effectiveFilter.dateRangeFilters
            );

            const response = await cashAdvanceServices.getCashAdvanceList(params);
            const payload = (response as any)?.data ?? {};
            const items = payload?.data ?? [];
            const totalCount = payload?.total ?? (items?.length || 0);
            const perPage = payload?.per_page ?? effectiveFilter.pageSize ?? 10;
            const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

            return {
                data: (items || []).map(mapRawToCashAdvanceEntity),
                total: totalCount,
                page: effectiveFilter.page || 1,
                pageSize: effectiveFilter.pageSize || 10,
                totalPages: totalPagesCalc,
            };
        } catch (error) {
            console.error('Repository Error - Failed to fetch cash advances:', error);
            throw new Error('Failed to fetch cash advances');
        }
    },

    /**
     * Get active and completed loans
     */
    async getActiveAndCompletedLoans(
        employeeId?: string, 
        filter?: Partial<TableFilter> & {
            columnFilters?: Record<string, string[]>;
            dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
        }
    ): Promise<ActiveAndCompletedLoansEntity[]> {
        try {
            const effectiveFilter = filter || {};
            const params = buildFilterParams(
                effectiveFilter,
                effectiveFilter.columnFilters,
                effectiveFilter.dateRangeFilters
            );

            if (employeeId) {
                params.employee_id = employeeId;
            }

            const response = await cashAdvanceServices.getActiveAndCompletedLoans(params);
            const payload = (response as any)?.data ?? {};
            const items = payload?.data ?? [];

            return (items || []).map(mapRawToActiveAndCompletedLoansEntity);
        } catch (error) {
            console.error('Repository Error - Failed to get active and completed loans:', error);
            throw new Error('Failed to get active and completed loans');
        }
    },

    /**
     * Get cash advance detail by ID
     */
    async getCashAdvanceDetail(id: string): Promise<CashAdvanceDetailResponseEntity | null> {
        try {
            const response = await cashAdvanceServices.getCashAdvanceDetail(id);
            
            if (!response) return null;

            return mapCashAdvanceDetailDTOToEntity(response);
        } catch (error) {
            console.error('Repository Error - Failed to get cash advance detail:', error);
            throw new Error('Failed to get cash advance detail');
        }
    },

    /**
     * Get employee info for cash advance
     */
    async getEmployeeInfo(employeeId: string): Promise<CashAdvanceEmployeeInfoEntity | null> {
        try {
            const response = await cashAdvanceServices.getEmployeeInfo(employeeId);
            const item = (response as any)?.data as any;
            
            if (!item) return null;

            return mapToCashAdvanceEmployeeInfoEntity({
                nip: item.nip,
                fullName: item.full_name,
            });
        } catch (error) {
            console.error('Repository Error - Failed to get employee info:', error);
            throw new Error('Failed to get employee info');
        }
    },

    /**
     * Approve cash advance
     */
    async approveCashAdvance(
        id: string, 
        status: 'Disetujui', 
        deductionStartPeriod: string, 
        disbursedAt: string
    ): Promise<CashAdvanceResponseEntity | null> {
        try {
            const formData = new FormData();
            formData.append('status', status);
            formData.append('deduction_start_period', deductionStartPeriod);
            formData.append('disbursed_at', disbursedAt);

            const response = await cashAdvanceServices.approveCashAdvance(id, formData);
            const responseData = (response as any)?.data;
            
            if (!responseData) return null;

            return mapToCashAdvanceResponseEntity(responseData);
        } catch (error) {
            console.error('Repository Error - Failed to approve cash advance:', error);
            throw new Error('Failed to approve cash advance');
        }
    },

    /**
     * Reject cash advance
     */
    async rejectCashAdvance(
        id: string, 
        status: 'Ditolak', 
        rejectionReason: string
    ): Promise<CashAdvanceResponseEntity | null> {
        try {
            const formData = new FormData();
            formData.append('status', status);
            formData.append('rejection_reason', rejectionReason);

            const response = await cashAdvanceServices.rejectCashAdvance(id, formData);
            const responseData = (response as any)?.data;
            
            if (!responseData) return null;

            return mapToCashAdvanceResponseEntity(responseData);
        } catch (error) {
            console.error('Repository Error - Failed to reject cash advance:', error);
            throw new Error('Failed to reject cash advance');
        }
    },
};
