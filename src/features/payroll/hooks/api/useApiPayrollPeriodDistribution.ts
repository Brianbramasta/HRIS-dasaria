import { useCallback, useState } from 'react';
import { TableFilter } from '@/types/SharedType';
import useFilterStore from '../../../../stores/filterStore';
import useTemporaryApiStore from '../../../../stores/useTemporaryApiStore';
import {
    PayrollPeriodDistributionListItem,
    PayrollPeriodDistributionSendSlipSalaryPayload,
} from '../../types/dto/PayrollPeriodDistributionType';
import { payrollPeriodDistributionService } from '../../services/PayrollPeriodDistributionService';

const toSortField = (field?: string): string => {
    const map: Record<string, string> = {
        employeeId: 'employee_id',
        fullName: 'full_name',
        periode: 'periode',
        email: 'email',
        bankName: 'bank_name',
        bankAccountNumber: 'bank_account_number',
        netSalary: 'net_salary',
        payrollStatusName: 'payroll_status_name',
    };
    return map[field || ''] || field || 'periode';
};

const mapToPayrollPeriodDistributionListItem = (item: any): PayrollPeriodDistributionListItem => ({
    payrollId: item.payroll_id,
    employeeId: item.employee_id,
    avatar: item.avatar,
    fullName: item.full_name,
    periode: item.periode,
    email: item.email,
    bankName: item.bank_name,
    bankAccountNumber: item.bank_account_number,
    netSalary: item.basic_salary || item.net_salary, // Use basic_salary from API response
    employeeCategoryName: item.employee_category_name,
    companyName: item.company_name,
    payrollStatusName: item.payroll_status_name,
});

interface UseApiPayrollPeriodDistributionReturn {
    payrollPeriods: PayrollPeriodDistributionListItem[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc' | null;
    type: 'Mitra' | 'Staff' | 'Thr' | null;

    columnFilters: Record<string, string[]>;
    dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;

    fetchPayrollPeriods: (filter?: Partial<TableFilter>) => Promise<void>;
    sendSlipSalary: (payload: PayrollPeriodDistributionSendSlipSalaryPayload) => Promise<boolean>;
    getSlipGajiUrl: (payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr') => string;

    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setSearch: (search: string) => void;
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setType: (type: 'Mitra' | 'Staff' | 'Thr' | null) => void;
    setColumnFilters: (filters: Record<string, string[]>) => void;
    setDateRangeFilters: (filters: Record<string, { startDate: string; endDate: string | null }>) => void;
}

export const useApiPayrollPeriodDistribution = (): UseApiPayrollPeriodDistributionReturn => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodDistributionListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [type, setType] = useState<'Mitra' | 'Staff' | 'Thr' | null>(null);

    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

    const filterStatus = useFilterStore((s) => s.filters['PayrollPeriodStatus'] ?? '');

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
                const effectiveType = filter?.type ?? type;

                const params: any = { page: effectivePage, per_page: effectivePageSize };
                if (effectiveSearch) params.search = effectiveSearch;
                if (effectiveStatus) params.status = effectiveStatus;
                if (effectiveType) params.type = effectiveType;
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

                const response = await payrollPeriodDistributionService.getPayrollPeriodDistributionList(params);

                const payload = (response as any)?.data ?? {};
                const items = payload?.data ?? [];
                const totalCount = payload?.total ?? (items?.length || 0);
                const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
                const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

                setPayrollPeriods((items || []).map(mapToPayrollPeriodDistributionListItem));
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
                setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods (Distribution)');
                console.error('Error fetching payroll periods (Distribution):', err);
            } finally {
                setLoading(false);
            }
        },
        [page, pageSize, search, sortBy, sortOrder, type, filterStatus, columnFilters, dateRangeFilters]
    );

    const sendSlipSalary = useCallback(async (payload: PayrollPeriodDistributionSendSlipSalaryPayload): Promise<boolean> => {
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

            if (payload.payrollPeriodeId) {
                formData.append('payroll_periode_id', payload.payrollPeriodeId);
            }

            if (payload.type) {
                formData.append('type', payload.type);
            }

            await payrollPeriodDistributionService.sendSlipSalary(formData);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send slip salary');
            console.error('Error send slip salary:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSlipGajiUrl = useCallback((payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr'): string => {
        const tempApiUrl = useTemporaryApiStore.getState().apiUrl;
        const baseURL = tempApiUrl || import.meta.env.VITE_API_URL;
        const url = `${baseURL}/payroll/payroll-periode/${payrollId}/slip-gaji`;
        if (type) {
            return `${url}?type=${type}`;
        }
        return url;
    }, []);

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
        type,

        columnFilters,
        dateRangeFilters,

        fetchPayrollPeriods,
        sendSlipSalary,
        getSlipGajiUrl,
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
        setType,
        setColumnFilters,
        setDateRangeFilters,
    };
};
