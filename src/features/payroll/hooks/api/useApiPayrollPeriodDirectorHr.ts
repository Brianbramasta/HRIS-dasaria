import { useCallback, useState } from 'react';
import { TableFilter } from '@/types/SharedType';
import useFilterStore from '../../../../stores/filterStore';
import {
    PayrollPeriodDirectorHrApprovalPayload,
    PayrollPeriodDirectorHrDetailData,
    PayrollPeriodDirectorHrListItem,
} from '../../types/dto/PayrollPeriodDirectorHrType';
import { payrollPeriodDirectorHrService } from '../../services/PayrollPeriodDirectorHrService';
import { formatFilterValue } from '@/utils/formatFilterValue';

const toSortField = (field?: string): string => {
    const map: Record<string, string> = {
        employeeId: 'employee_id',
        fullName: 'full_name',
        periode: 'periode',
        netSalary: 'net_salary',
        payrollStatusName: 'payroll_status_name',
    };
    return map[field || ''] || field || 'periode';
};

const mapToPayrollPeriodDirectorHrListItem = (item: any): PayrollPeriodDirectorHrListItem => ({
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

interface UseApiPayrollPeriodDirectorHrOptions {
    initialType?: 'Mitra' | 'Staff' | 'Thr';
    resetKey?: string;
}

interface UseApiPayrollPeriodDirectorHrReturn {
    payrollPeriods: PayrollPeriodDirectorHrListItem[];
    payrollPeriodDetail: PayrollPeriodDirectorHrDetailData | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc' | null;
    type: 'Mitra' | 'Staff' | 'Thr';

    columnFilters: Record<string, string[]>;
    dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;

    fetchPayrollPeriods: (filter?: Partial<TableFilter>) => Promise<void>;
    fetchPayrollPeriodDetail: (payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr') => Promise<PayrollPeriodDirectorHrDetailData | null>;
    approvalDirectorHr: (payload: PayrollPeriodDirectorHrApprovalPayload, type?: 'Mitra' | 'Staff' | 'Thr') => Promise<boolean>;

    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setColumnFilters: (filters: Record<string, string[]>) => void;
    setDateRangeFilters: (filters: Record<string, { startDate: string; endDate: string | null }>) => void;
    setType: (type: 'Mitra' | 'Staff' | 'Thr') => void;
}

export const useApiPayrollPeriodDirectorHr = (options: UseApiPayrollPeriodDirectorHrOptions = {}, title:string = 'Periode Gajian'): UseApiPayrollPeriodDirectorHrReturn => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodDirectorHrListItem[]>([]);
    const [payrollPeriodDetail, setPayrollPeriodDetail] = useState<PayrollPeriodDirectorHrDetailData | null>(null);
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
    const [type, setType] = useState<'Mitra' | 'Staff' | 'Thr'>(options.initialType ?? 'Staff');
    console.log(title,'title')

    const filterValue = formatFilterValue(useFilterStore((s) => s.filters[s.resetKey]));
    console.log(filterValue,'filterValue9')

    const fetchPayrollPeriods = useCallback(
        async (filter?: Partial<TableFilter>) => {
            console.log('test')
            setLoading(true);
            setError(null);

            try {
                const overrideColumnFilters = (filter as any)?.columnFilters as Record<string, string[]> | undefined;
                const overrideDateRangeFilters = (filter as any)?.dateRangeFilters as
                    | Record<string, { startDate: string; endDate: string | null }>
                    | undefined;

                const effectiveColumnFilters = overrideColumnFilters ?? columnFilters;
                const effectiveDateRangeFilters = overrideDateRangeFilters ?? dateRangeFilters;

                const effectivePage = filter?.page ?? page;
                const effectivePageSize = filter?.pageSize ?? pageSize;
                const effectiveSearch = filter?.search ?? search;
                const effectiveSortBy = filter?.sortBy ?? sortBy;
                const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
                const effectiveFilter = filter?.filter ?? filterValue;
                // const effectiveStatus = filter?.filter ?? filterStatus;

                const params: any = { page: effectivePage, per_page: effectivePageSize };
                if (effectiveSearch) params.search = effectiveSearch;
                if (effectiveFilter) params.filter = effectiveFilter;
                if (type) params.type = type;
                if (effectiveSortBy) {
                    params.column = toSortField(effectiveSortBy);
                    if (effectiveSortOrder) params.sort = effectiveSortOrder;
                }

                Object.entries(effectiveColumnFilters).forEach(([columnId, values]) => {
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

                Object.entries(effectiveDateRangeFilters).forEach(([columnId, dateRange]) => {
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

                const response = await payrollPeriodDirectorHrService.getPayrollPeriodPendingDirectorHrList(params);

                const payload = (response as any)?.data ?? {};
                const items = payload?.data ?? [];
                const totalCount = payload?.total ?? (items?.length || 0);
                const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
                const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

                setPayrollPeriods((items || []).map(mapToPayrollPeriodDirectorHrListItem));
                setTotal(totalCount);
                setTotalPages(totalPagesCalc);

                if (filter?.page) setPage(filter.page);
                if (filter?.pageSize) setPageSize(filter.pageSize);
                if (filter?.search !== undefined) setSearch(filter.search);
                if (filter?.sortBy) setSortBy(filter.sortBy);
                if (filter?.sortOrder) setSortOrder(filter.sortOrder);
                if (overrideColumnFilters) setColumnFilters(overrideColumnFilters);
                if (overrideDateRangeFilters) setDateRangeFilters(overrideDateRangeFilters);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods (Director HR)');
                console.error('Error fetching payroll periods (Director HR):', err);
            } finally {
                setLoading(false);
            }
        },
        [type, page, pageSize, search, sortBy, sortOrder, filterValue, columnFilters, dateRangeFilters]
    );

    const fetchPayrollPeriodDetail = useCallback(async (payrollId: string, typeParam?: 'Mitra' | 'Staff' | 'Thr'): Promise<PayrollPeriodDirectorHrDetailData | null> => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {};
            const effectiveType = typeParam || type;
            if (effectiveType) params.type = effectiveType;
            const response = await payrollPeriodDirectorHrService.getPayrollPeriodDirectorHrDetail(payrollId, params);
            const detail = response.data ?? null;
            setPayrollPeriodDetail(detail);
            return detail;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payroll period detail (Director HR)');
            console.error('Error fetching payroll period detail (Director HR):', err);
            setPayrollPeriodDetail(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [type]);

    const approvalDirectorHr = useCallback(async (payload: PayrollPeriodDirectorHrApprovalPayload, type?: 'Mitra' | 'Staff' | 'Thr'): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            if (type) {
                formData.append('type', type);
            }
            if (payload.all) {
                formData.append('all', 'true');
            } else {
                payload.payrollIds.forEach((id, index) => {
                    formData.append(`payroll_id[${index}]`, id);
                });
            }

            await payrollPeriodDirectorHrService.approvalDirectorHr(formData, type);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approval Director HR');
            console.error('Error approval Director HR:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        payrollPeriods,
        payrollPeriodDetail,
        loading,
        error,
        total,
        page,
        pageSize,
        totalPages,
        search,
        sortBy,
        sortOrder,
        type,

        columnFilters,
        dateRangeFilters,

        fetchPayrollPeriods,
        fetchPayrollPeriodDetail,
        approvalDirectorHr,
        setPage,
        setPageSize,
        setSearch: (v) => {
            setSearch(v);
            setPage(1);
        },
        setSort: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
        },
        setColumnFilters,
        setDateRangeFilters,
        setType,
    };
};
