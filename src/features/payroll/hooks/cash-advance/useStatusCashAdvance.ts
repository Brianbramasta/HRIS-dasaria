import { useEffect, useMemo, useState, useCallback } from 'react';
import { cashAdvanceRepository } from '../../repositories/CashAdvanceRepository';
import { ActiveAndCompletedLoansEntity } from '../../models/CashAdvanceModel';
import { useNavigate } from 'react-router-dom';
import { TableFilter } from '@/types/SharedType';

export const useStatusCashAdvance = () => {
    const navigate = useNavigate();

    // State management
    const [loans, setLoans] = useState<ActiveAndCompletedLoansEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

    // Build filter object
    const buildFilter = useCallback((): Partial<TableFilter> & {
        columnFilters?: Record<string, string[]>;
        dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;
    } => ({
        search,
        sortBy,
        sortOrder,
        page,
        pageSize,
        columnFilters,
        dateRangeFilters,
    }), [search, sortBy, sortOrder, page, pageSize, columnFilters, dateRangeFilters]);

    // Fetch data with pagination, search, and filters
    const fetchLoans = useCallback(async (filter?: Partial<TableFilter>) => {
        setLoading(true);
        
        try {
            const effectiveFilter = filter || buildFilter();
            const result = await cashAdvanceRepository.getActiveAndCompletedLoans(undefined, effectiveFilter);
            if (result) {
                setLoans(result);
                setTotal(result.length || 0); // For active and completed loans, use array length
            }
        } catch (err) {
            console.error('Error fetching loans:', err);
        } finally {
            setLoading(false);
        }
    }, [buildFilter]);

    // Auto-fetch when page, pageSize, columnFilters, or dateRangeFilters change
    useEffect(() => {
        fetchLoans();
    }, [page, pageSize, columnFilters, dateRangeFilters, fetchLoans]);

    const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
        setDateRangeFilters({
            ...dateRangeFilters,
            [columnId]: { startDate, endDate },
        });
    }, [dateRangeFilters, setDateRangeFilters]);

    const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
        setColumnFilters({
            ...columnFilters,
            [columnId]: values,
        });
    }, [columnFilters, setColumnFilters]);

    const handleSearchChange = useCallback((search: string) => {
        fetchLoans({ search });
    }, [fetchLoans]);

    const handleSortChange = useCallback((columnId: string, order: 'asc' | 'desc') => {
        setSortBy(columnId);
        setSortOrder(order);
        fetchLoans({ sortBy: columnId, sortOrder: order });
    }, [fetchLoans, setSortBy, setSortOrder]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when changing page size
    }, []);

    const handleSetSearch = useCallback((newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
    }, []);

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSetPageSize = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    }, []);

    const handleSetSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    }, []);

    const rows = useMemo(() => {
        return loans.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            nip: item.nip,
            loan_id: item.loan_id,
            full_name: item.full_name,
            avatar: item.avatar,
            application_date: item.application_date,
            position_name: item.position_name,
            department_name: item.department_name,
            deduction_start_period: item.deduction_start_period,
            deduction_end_period: item.deduction_end_period || '-',
            disbursed_at: item.disbursed_at,
            loan_type_name: item.loan_type_name,
            nominal_loan: String(item.nominal_loan),
            nominal_installment: String(item.nominal_installment),
            loan_period: `${item.loan_period} bulan`,
            loan_status: item.loan_status as any,
            remaining_balance: String(item.remaining_balance || 0),
            total_active_kasbon: item.total_active_kasbon || 0,
            total_periode_kasbon: item.total_periode_kasbon || item.loan_period,
            has_active_loan: item.has_active_loan || false,
        }));
    }, [loans, page, pageSize]);

    return {
        rows,
        loading,
        total,
        page,
        pageSize,
        dateRangeFilters,
        columnFilters,
        handleDateRangeFilterChange,
        handleColumnFilterChange,
        handleSearchChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setSearch: handleSetSearch,
        setSort: handleSetSort,
        navigate,
    };
};
