import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
    CashAdvanceListItem,
    CashAdvanceDetail,
    CashAdvanceEmployeeInfo,
    CashAdvanceApprovePayload,
    CashAdvanceRejectPayload,
    CashAdvanceResponse,
} from '../../types/dto/CashAdvanceType';
import { cashAdvanceServices } from '../../services/CashAdvanceServices';
import useFilterStore from '../../../../stores/filterStore';

// Mapping helpers
const mapToCashAdvanceListItem = (item: any): CashAdvanceListItem => ({
    employeeId: item.employee_id,
    fullName: item.full_name,
    email: item.email,
    nationalId: item.national_id,
    loanId: item.loan_id,
    applicationDate: item.application_date,
    nominalLoan: item.nominal_loan,
    nominalInstallment: item.nominal_installment,
    loanPeriod: item.loan_period,
    disbursedAt: item.disbursed_at,
    loanTypeName: item.loan_type_name,
    loanStatusName: item.loan_status_name,
    positionName: item.position_name,
    departmentName: item.department_name,
});

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

interface UseApiCashAdvanceReturn {
    cashAdvances: CashAdvanceListItem[];
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

    // Actions
    fetchCashAdvances: (filter?: Partial<TableFilter>) => Promise<void>;
    getCashAdvanceDetail: (id: string) => Promise<CashAdvanceDetail | null>;
    getEmployeeInfo: (employeeId: string) => Promise<CashAdvanceEmployeeInfo | null>;
    approveCashAdvance: (id: string, payload: CashAdvanceApprovePayload) => Promise<CashAdvanceResponse | null>;
    rejectCashAdvance: (id: string, payload: CashAdvanceRejectPayload) => Promise<CashAdvanceResponse | null>;

    // Pagination
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;

    // Search & Filter
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiCashAdvance = (): UseApiCashAdvanceReturn => {
    const [cashAdvances, setCashAdvances] = useState<CashAdvanceListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const filterStatus = useFilterStore((s) => s.filters['CashAdvanceStatus'] ?? '');

    const fetchCashAdvances = useCallback(async (filter?: Partial<TableFilter>) => {
        setLoading(true);
        setError(null);

        try {
            const effectivePage = filter?.page ?? page;
            const effectivePageSize = filter?.pageSize ?? pageSize;
            const effectiveSearch = filter?.search ?? search;
            const effectiveSortBy = filter?.sortBy ?? sortBy;
            const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
            const effectiveStatus = filter?.filter ?? filterStatus;

            const params: any = { page: effectivePage, per_page: effectivePageSize };
            if (effectiveSearch) params.search = effectiveSearch;
            if (effectiveStatus) params.status = effectiveStatus;
            if (effectiveSortBy) {
                params.column = toSortField(effectiveSortBy);
                if (effectiveSortOrder) params.sort = effectiveSortOrder;
            }

            const response = await cashAdvanceServices.getCashAdvanceList(params);

            const payload = (response as any)?.data ?? {};
            const items = payload?.data ?? [];
            const totalCount = payload?.total ?? (items?.length || 0);
            const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
            const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

            setCashAdvances((items || []).map(mapToCashAdvanceListItem));
            setTotal(totalCount);
            setTotalPages(totalPagesCalc);

            if (filter?.page) setPage(filter.page);
            if (filter?.pageSize) setPageSize(filter.pageSize);
            if (filter?.search !== undefined) setSearch(filter.search);
            if (filter?.sortBy) setSortBy(filter.sortBy);
            if (filter?.sortOrder) setSortOrder(filter.sortOrder);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cash advances');
            console.error('Error fetching cash advances:', err);
        } finally {
            setLoading(false);
        }
    }, [search, sortBy, sortOrder, page, pageSize, filterStatus]);

    const getCashAdvanceDetail = useCallback(async (id: string): Promise<CashAdvanceDetail | null> => {
        setLoading(true);
        setError(null);
        try {
            const resp = await cashAdvanceServices.getCashAdvanceDetail(id);
            const item = (resp as any)?.data as any;
            if (!item) return null;

            return {
                loanId: item.loan_id,
                nip: item.nip,
                fullName: item.full_name,
                applicationDate: item.application_date,
                positionName: item.position_name,
                departmentName: item.department_name,
                deductionStartPeriod: item.deduction_start_period,
                loanTypeName: item.loan_type_name,
                nominalLoan: item.nominal_loan,
                loanPeriod: item.loan_period,
                nominalInstallment: item.nominal_installment,
                supervisorApprovalFile: item.supervisor_approval_file,
                supportingDocuments: item.supporting_documents,
                loanDescription: item.loan_description,
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get cash advance detail');
            console.error('Error getting cash advance detail:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getEmployeeInfo = useCallback(async (employeeId: string): Promise<CashAdvanceEmployeeInfo | null> => {
        setLoading(true);
        setError(null);
        try {
            const resp = await cashAdvanceServices.getEmployeeInfo(employeeId);
            const item = (resp as any)?.data as any;
            if (!item) return null;

            return {
                nip: item.nip,
                fullName: item.full_name,
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get employee info');
            console.error('Error getting employee info:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const approveCashAdvance = useCallback(async (id: string, payload: CashAdvanceApprovePayload): Promise<CashAdvanceResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('status', payload.status);
            formData.append('deduction_start_period', payload.deductionStartPeriod);
            formData.append('disbursed_at', payload.disbursedAt);

            const resp = await cashAdvanceServices.approveCashAdvance(id, formData);
            return (resp as any)?.data ?? null;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve cash advance');
            console.error('Error approving cash advance:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const rejectCashAdvance = useCallback(async (id: string, payload: CashAdvanceRejectPayload): Promise<CashAdvanceResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('status', payload.status);
            formData.append('rejection_reason', payload.rejectionReason);

            const resp = await cashAdvanceServices.rejectCashAdvance(id, formData);
            return (resp as any)?.data ?? null;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reject cash advance');
            console.error('Error rejecting cash advance:', err);
            return null;
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

    return {
        cashAdvances,
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

        fetchCashAdvances,
        getCashAdvanceDetail,
        getEmployeeInfo,
        approveCashAdvance,
        rejectCashAdvance,

        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setSearch: handleSetSearch,
        setSort: handleSetSort,
    };
};
