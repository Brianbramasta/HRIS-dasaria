import { useEffect, useMemo, useState, useCallback } from 'react';
import { cashAdvanceRepository } from '../../repositories/CashAdvanceRepository';
import { CashAdvanceEntity } from '../../models/CashAdvanceModel';
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { TableFilter } from '@/types/SharedType';

export const useCashAdvanceHistory = () => {
    const navigate = useNavigate();

    // State management
    const [cashAdvances, setCashAdvances] = useState<CashAdvanceEntity[]>([]);
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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const submissionModal = useModal(false);
    const shareModal = useModal(false);

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

    // Fetch cash advances
    const fetchCashAdvances = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const filter = buildFilter();
            const response = await cashAdvanceRepository.getCashAdvances(filter);

            setCashAdvances(response.data);
            setTotal(response.total);
            setPage(response.page);
            setPageSize(response.pageSize);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cash advances');
            console.error('Error fetching cash advances:', err);
        } finally {
            setLoading(false);
        }
    }, [buildFilter]);

    // Initial fetch
    useEffect(() => {
        fetchCashAdvances();
    }, [fetchCashAdvances]);

    // Fetch when filters change
    useEffect(() => {
        fetchCashAdvances();
    }, [columnFilters, dateRangeFilters, fetchCashAdvances]);

    const handleOpenShare = () => {
        shareModal.openModal();
    };

    const handleOpenFormKasbon = () => {
        submissionModal.closeModal();
        navigate('/cash-advance/cash-advance-form');
    };

    const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
        setDateRangeFilters({
            ...dateRangeFilters,
            [columnId]: { startDate, endDate },
        });
    }, [dateRangeFilters, setDateRangeFilters]);

    const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnId]: values,
        }));
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

    // Map entities to UI format
    const rows = useMemo(() => {
        console.log(cashAdvances,'cashAdvances');
        return cashAdvances.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            employee_id: item.employee_id,
            full_name: item.full_name,
            email: item.email,
            national_id: item.national_id,
            loan_id: item.loan_id,
            avatar: item.avatar,
            application_date: item.application_date,
            position_name: item.position_name,
            department_name: item.department_name,
            deduction_start_period: item.deduction_start_period || '',
            disbursed_at: item.disbursed_at || '',
            loan_type_name: item.loan_type_name,
            nominal_loan: String(item.nominal_loan),
            nominal_installment: String(item.nominal_installment),
            loan_period: item.loan_period ? `${item.loan_period} bulan` : '',
            loan_status_name: item.loan_status_name as any,
            rejection_reason: item.rejection_reason || '',
            raw: item,
        }));
    }, [cashAdvances, page, pageSize]);

    return {
        rows,
        loading,
        error,
        total,
        page,
        pageSize,
        totalPages,
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setSearch: handleSetSearch,
        setSort: handleSetSort,
        isDropdownOpen,
        setIsDropdownOpen,
        submissionModal,
        shareModal,
        handleOpenShare,
        handleOpenFormKasbon,
        dateRangeFilters,
        columnFilters,
        handleDateRangeFilterChange,
        handleColumnFilterChange,
        navigate,
    };
};
