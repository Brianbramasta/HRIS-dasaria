import { useCallback, useState } from 'react';
import { TableFilter } from '@/types/SharedType';
import useFilterStore from '../../../../stores/filterStore';
import {
    PayrollPeriodBodApprovalPayload,
    PayrollPeriodBodDetailData,
    PayrollPeriodBodListItem,
} from '../../types/dto/PayrollPeriodBodType';
import { payrollPeriodBodService } from '../../services/PayrollPeriodBodService';
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

const mapToPayrollPeriodBodListItem = (item: any): PayrollPeriodBodListItem => ({
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

interface UseApiPayrollPeriodBodTHRReturn {
    payrollPeriods: PayrollPeriodBodListItem[];
    payrollPeriodDetail: PayrollPeriodBodDetailData | null;
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
    fetchPayrollPeriodDetail: (payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr') => Promise<PayrollPeriodBodDetailData | null>;
    approvalBod: (payload: PayrollPeriodBodApprovalPayload, type?: 'Mitra' | 'Staff' | 'Thr') => Promise<boolean>;

    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setColumnFilters: (filters: Record<string, string[]>) => void;
    setDateRangeFilters: (filters: Record<string, { startDate: string; endDate: string | null }>) => void;
    setType: (type: 'Mitra' | 'Staff' | 'Thr') => void;
}

export const useApiPayrollPeriodBodTHR = (): UseApiPayrollPeriodBodTHRReturn => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodBodListItem[]>([]);
    const [payrollPeriodDetail, setPayrollPeriodDetail] = useState<PayrollPeriodBodDetailData | null>(null);
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
    const [type, setType] = useState<'Mitra' | 'Staff' | 'Thr'>('Thr'); // Default to 'Thr' for THR pages

    const filterStatus = formatFilterValue(useFilterStore((s) => s.filters[s.resetKey]));

    const fetchPayrollPeriods = useCallback(
        async (filter?: Partial<TableFilter>) => {
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
                const effectiveStatus = filter?.filter ?? filterStatus;

                const params: any = { page: effectivePage, per_page: effectivePageSize };
                if (effectiveSearch) params.search = effectiveSearch;
                if (effectiveStatus) params.filter = effectiveStatus;
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

                const response = await payrollPeriodBodService.getPayrollPeriodBodList(params);

                const payload = (response as any)?.data ?? {};
                const items = payload?.data ?? [];
                const totalCount = payload?.total ?? (items?.length || 0);
                const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
                const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

                setPayrollPeriods((items || []).map(mapToPayrollPeriodBodListItem));
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
                setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods (BOD)');
                console.error('Error fetching payroll periods (BOD):', err);
            } finally {
                setLoading(false);
            }
        },
        [type, page, pageSize, search, sortBy, sortOrder, filterStatus, columnFilters, dateRangeFilters]
    );

    const fetchPayrollPeriodDetail = useCallback(async (payrollId: string, typeParam?: 'Mitra' | 'Staff' | 'Thr'): Promise<PayrollPeriodBodDetailData | null> => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {};
            const effectiveType = typeParam || type;
            if (effectiveType) params.type = effectiveType;
            const response = await payrollPeriodBodService.getPayrollPeriodBodDetail(payrollId, params);
            const detail = response.data ?? null;
            setPayrollPeriodDetail(detail);
            return detail;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payroll period detail (BOD)');
            console.error('Error fetching payroll period detail (BOD):', err);
            setPayrollPeriodDetail(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [type]);

    const approvalBod = useCallback(async (payload: PayrollPeriodBodApprovalPayload, type?: 'Mitra' | 'Staff' | 'Thr'): Promise<boolean> => {
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

            await payrollPeriodBodService.approvalBod(formData, type);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approval BOD');
            console.error('Error approval BOD:', err);
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
        approvalBod,
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
