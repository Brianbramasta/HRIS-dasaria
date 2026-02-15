import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import { PayrollPeriodListItem } from '../../types/dto/PayrollPeriodType';
import { payrollPeriodService } from '../../services/PayrollPeriodService';
import useFilterStore from '../../../../stores/filterStore';

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
    fetchPayrollPeriods: (filter?: Partial<TableFilter>) => Promise<void>;

    // Pagination
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;

    // Search & Filter
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setColumnFilters: (filters: Record<string, string[]>) => void;
    setDateRangeFilters: (filters: Record<string, { startDate: string; endDate: string | null }>) => void;

    // Column filters
    columnFilters: Record<string, string[]>;
    dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
}

export const useApiPayrollPeriod = (): UseApiPayrollPeriodReturn => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

    const filterStatus = useFilterStore((s) => s.filters['PayrollPeriodStatus'] ?? '');

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

                const params: any = { page: effectivePage, per_page: effectivePageSize };
                if (effectiveSearch) params.search = effectiveSearch;
                if (effectiveStatus) params.status = effectiveStatus;
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
        [search, sortBy, sortOrder, page, pageSize, filterStatus, columnFilters, dateRangeFilters]
    );

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

        fetchPayrollPeriods,

        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setSearch: handleSetSearch,
        setSort: handleSetSort,
        setColumnFilters: handleSetColumnFilters,
        setDateRangeFilters: handleSetDateRangeFilters,

        columnFilters,
        dateRangeFilters,
    };
};
