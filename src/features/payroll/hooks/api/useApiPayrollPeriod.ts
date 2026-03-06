import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
    PayrollPeriodDetailData,
    PayrollPeriodListItem,
    PayrollPeriodImportApprovalStatusData,
    PayrollPeriodUpdateNonFixAllowancePayload,
    PayrollPeriodUpdateNonFixDeductionPayload,
    PayrollPeriodUpdateWorkingDaysPayload,
    PayrollPeriodApprovalHrPayload,
    PayrollPeriodUpdateNotePayload,
    PayrollPeriodDeletePayload,
} from '../../types/dto/PayrollPeriodType';
import { payrollPeriodService } from '../../services/PayrollPeriodService';
import useFilterStore from '../../../../stores/filterStore';
import { usePayrollApprovalStore } from '../../store/usePayrollApprovalStore';

// Mapping helpers
const mapToPayrollPeriodListItem = (item: any): PayrollPeriodListItem => ({
    payrollId: item.payroll_id,
    employeeId: item.employee_id,
    avatar: item.avatar,
    fullName: item.full_name,
    periode: item.periode,
    workingDays: item.working_days,
    netSalary: item.net_salary,
    basicSalary: item.basic_salary,
    deductionTotal: item.deduction_total,
    allowanceTotal: item.allowance_total,
    nonFixedAllowanceTotal: item.non_fixed_allowance_total,
    employeeCategoryName: item.employee_category_name,
    companyName: item.company_name,
    payrollStatusName: item.payroll_status_name,
});

const toSortField = (field?: string): string => {
    const map: Record<string, string> = {
        payrollId: 'payroll_id',
        employeeId: 'employee_id',
        fullName: 'full_name',
        periode: 'periode',
        netSalary: 'net_salary',
        payrollStatusName: 'payroll_status_name',
    };
    return map[field || ''] || field || 'periode';
};

interface UseApiPayrollPeriodReturn {
    payrollPeriods: PayrollPeriodListItem[];
    payrollPeriodDetail: PayrollPeriodDetailData | null;
    importApprovalStatus: PayrollPeriodImportApprovalStatusData | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc' | null;
    filterStatus: string;
    type: string;

    // Actions
    fetchPayrollPeriods: (filter?: Partial<TableFilter>) => Promise<void>;
    fetchPayrollPeriodDetail: (payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr') => Promise<PayrollPeriodDetailData | null>;
    fetchImportApprovalStatus: (params?: {
        type?: string;
        periodeSalary?: boolean;
        HRGA?: boolean;
        FAT?: boolean;
        BOD?: boolean;
        distribution?: boolean;
    }) => Promise<PayrollPeriodImportApprovalStatusData | null>;
    updateNonFixAllowance: (payload: PayrollPeriodUpdateNonFixAllowancePayload) => Promise<boolean>;
    updateNonFixDeduction: (payload: PayrollPeriodUpdateNonFixDeductionPayload) => Promise<boolean>;
    updateWorkingDays: (payload: PayrollPeriodUpdateWorkingDaysPayload) => Promise<boolean>;
    updateNote: (payload: PayrollPeriodUpdateNotePayload) => Promise<boolean>;
    deletePayrollPeriod: (payload: PayrollPeriodDeletePayload) => Promise<boolean>;
    approvalHr: (payload: PayrollPeriodApprovalHrPayload) => Promise<boolean>;
    processUpload: (file: File, type?: string) => Promise<boolean>;

    // Pagination
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;

    // Search & Filter
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setColumnFilters: (filters: Record<string, string[]>) => void;
    setDateRangeFilters: (filters: Record<string, { startDate: string; endDate: string | null }>) => void;
    setType: (type: string) => void;

    // Column filters
    columnFilters: Record<string, string[]>;
    dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
}

export const useApiPayrollPeriod = (): UseApiPayrollPeriodReturn => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodListItem[]>([]);
    const [payrollPeriodDetail, setPayrollPeriodDetail] = useState<PayrollPeriodDetailData | null>(null);
    const [importApprovalStatus, setImportApprovalStatus] = useState<PayrollPeriodImportApprovalStatusData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [type, setType] = useState<string>('Mitra');
    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

    const filterStatus = useFilterStore((s) => (s.filters['PayrollPeriodStatus'] ?? []).join(','));

    const fetchPayrollPeriods = useCallback(
        async (filter?: Partial<TableFilter>) => {
            setLoading(true);
            setError(null);

            try {
                const effectivePage = filter?.page ?? page;
                const effectivePageSize = filter?.pageSize ?? pageSize;
                const effectiveSearch = filter?.search ?? search;
                const effectiveSortBy = filter?.sortBy ?? sortBy;
                const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
                const effectiveStatus = filter?.filter ?? filterStatus;
                const effectiveType = filter?.type ?? type;

                const params: any = { page: effectivePage, per_page: effectivePageSize };
                if (effectiveSearch) params.search = effectiveSearch;
                if (effectiveStatus) params.status = effectiveStatus;
                if (effectiveType) params.type = effectiveType;
                if (effectiveSortBy) {
                    params.column = toSortField(effectiveSortBy);
                    if (effectiveSortOrder) params.sort = effectiveSortOrder;
                }

                // Add column filters - format: filter_column[column_name][in][]=value
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

                // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
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

                const response = await payrollPeriodService.getPayrollPeriodList(params);

                const payload = (response as any)?.data ?? {};
                const items = payload?.data ?? [];
                const totalCount = payload?.total ?? (items?.length || 0);
                const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
                const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

                console.log(items,' items');

                setPayrollPeriods((items || []).map(mapToPayrollPeriodListItem));
                setTotal(totalCount);
                setTotalPages(totalPagesCalc);

                if (filter?.page) setPage(filter.page);
                if (filter?.pageSize) setPageSize(filter.pageSize);
                if (filter?.search !== undefined) setSearch(filter.search);
                if (filter?.sortBy) setSortBy(filter.sortBy);
                if (filter?.sortOrder) setSortOrder(filter.sortOrder);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods');
                console.error('Error fetching payroll periods:', err);
            } finally {
                setLoading(false);
            }
        },
        [search, sortBy, sortOrder, page, pageSize, filterStatus, type, columnFilters, dateRangeFilters]
    );

    const fetchPayrollPeriodDetail = useCallback(async (payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr'): Promise<PayrollPeriodDetailData | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await payrollPeriodService.getPayrollPeriodDetail(payrollId, type);
            const detail = (response as any)?.data ?? null;
            setPayrollPeriodDetail(detail);
            return detail;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payroll period detail');
            console.error('Error fetching payroll period detail:', err);
            setPayrollPeriodDetail(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchImportApprovalStatus = useCallback(async (
        params?: {
            type?: string;
            periodeSalary?: boolean;
            HRGA?: boolean;
            FAT?: boolean;
            BOD?: boolean;
            distribution?: boolean;
        }
    ): Promise<PayrollPeriodImportApprovalStatusData | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await payrollPeriodService.getImportApprovalStatus(params);
            const status = response?.data ?? null;
            setImportApprovalStatus(status);
            
            // Update approval store with the status
            if (status) {
                const approvalStore = usePayrollApprovalStore.getState();
                approvalStore.setApprovalStatus(status);
            }
            
            console.log(status, 'status 1');
            return status;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch import approval status');
            console.error('Error fetching import approval status:', err);
            setImportApprovalStatus(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePayrollPeriod = useCallback(async (payload: PayrollPeriodDeletePayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'DELETE');

            await payrollPeriodService.deletePayrollPeriod(payload.payrollId, formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete payroll period');
            console.error('Error deleting payroll period:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNote = useCallback(async (payload: PayrollPeriodUpdateNotePayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            if (payload.noteHr !== undefined) formData.append('note_hr', String(payload.noteHr ?? ''));
            if (payload.noteBod !== undefined) formData.append('note_bod', String(payload.noteBod ?? ''));
            if (payload.type !== undefined) formData.append('type', String(payload.type ?? ''));
            if (payload.holiday_allowance !== undefined) formData.append('holiday_allowance', String(payload.holiday_allowance ?? ''));

            await payrollPeriodService.updateNote(payload.payrollId, formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update note');
            console.error('Error updating note:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNonFixAllowance = useCallback(async (payload: PayrollPeriodUpdateNonFixAllowancePayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            payload.nonFixedAllowances.forEach((item, index) => {
                formData.append(`non_fixed_allowances[${index}][componen_id]`, item.componenId);
                formData.append(`non_fixed_allowances[${index}][amount]`, String(item.amount));
            });

            await payrollPeriodService.updateNonFixAllowance(payload.payrollId, formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update non fixed allowance');
            console.error('Error updating non fixed allowance:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNonFixDeduction = useCallback(async (payload: PayrollPeriodUpdateNonFixDeductionPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            payload.nonFixedDeductions.forEach((item, index) => {
                formData.append(`non_fixed_deductions[${index}][componen_id]`, item.componenId);
                formData.append(`non_fixed_deductions[${index}][amount]`, String(item.amount));
            });

            await payrollPeriodService.updateNonFixDeduction(payload.payrollId, formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update non fixed deduction');
            console.error('Error updating non fixed deduction:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateWorkingDays = useCallback(async (payload: PayrollPeriodUpdateWorkingDaysPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            formData.append('working_days', String(payload.workingDays));

            await payrollPeriodService.updateWorkingDays(payload.payrollId, formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update working days');
            console.error('Error updating working days:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const approvalHr = useCallback(async (payload: PayrollPeriodApprovalHrPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            if (payload.all) {
                formData.append('all', 'true');
            } else {
                payload.payrollIds.forEach((id, index) => {
                    formData.append(`payroll_id[${index}]`, id);
                });
            }
            console.log(payload,'payload')
            const typeParam = payload.type ? `?type=${payload.type}` : '';
            await payrollPeriodService.approvalHr(formData, typeParam);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approval HR');
            console.error('Error approval HR:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const processUpload = useCallback(async (file: File, type?: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file_excel', file);

            const typeParam = type ? `?type=${type}` : '';
            await payrollPeriodService.processUpload(formData, typeParam);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
            console.error('Error uploading payroll period excel:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSetPageSize = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    }, []);

    const handleSetSearch = useCallback((newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
    }, []);

    const handleSetSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    }, []);

    const handleSetColumnFilters = useCallback((newColumnFilters: Record<string, string[]>) => {
        setColumnFilters(newColumnFilters);
    }, []);

    const handleSetDateRangeFilters = useCallback(
        (newDateRangeFilters: Record<string, { startDate: string; endDate: string | null }>) => {
            setDateRangeFilters(newDateRangeFilters);
        },
        []
    );

    return {
        payrollPeriods,
        payrollPeriodDetail,
        importApprovalStatus,
        loading,
        error,
        total,
        page,
        pageSize,
        totalPages,
        search,
        sortBy,
        sortOrder,
        filterStatus,
        type,

        fetchPayrollPeriods,
        fetchPayrollPeriodDetail,
        fetchImportApprovalStatus,
        updateNonFixAllowance,
        updateNonFixDeduction,
        updateWorkingDays,
        updateNote,
        deletePayrollPeriod,
        approvalHr,
        processUpload,

        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setSearch: handleSetSearch,
        setSort: handleSetSort,
        setColumnFilters: handleSetColumnFilters,
        setDateRangeFilters: handleSetDateRangeFilters,
        setType,

        columnFilters,
        dateRangeFilters,
    };
}
