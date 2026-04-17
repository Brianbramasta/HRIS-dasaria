import { useEffect, useMemo, useState, useCallback } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { useNavigate } from 'react-router-dom';
import { TableFilter } from '@/types/SharedType';

export const useStatusCashAdvance = () => {
    const navigate = useNavigate();
    const api = useApiCashAdvance();
    const {
        getActiveAndCompletedLoans,
        loading,
        page,
        pageSize,
        total,
        setPage,
        setPageSize,
        setSearch,
        setSort,
        columnFilters,
        dateRangeFilters,
        setColumnFilters,
        setDateRangeFilters,
    } = api;

    const [loans, setLoans] = useState<any[]>([]);

    // Fetch data with pagination, search, and filters
    const fetchLoans = useCallback(async (filter?: Partial<TableFilter>) => {
        const result = await getActiveAndCompletedLoans(undefined, filter);
        if (result) {
            setLoans(result);
        }
    }, [getActiveAndCompletedLoans]);

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
        fetchLoans({ sortBy: columnId, sortOrder: order });
    }, [fetchLoans]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when changing page size
    }, []);

    const rows = useMemo(() => {
        return loans.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            employee_id: item.employeeId,
            loan_id: item.loanId,
            full_name: item.fullName,
            avatar: item.avatar,
            application_date: item.applicationDate,
            position_name: item.positionName,
            department_name: item.departmentName,
            deduction_start_period: item.deductionStartPeriod,
            disbursed_at: item.disbursedAt,
            loan_type_name: item.loanTypeName,
            nominal_loan: String(item.nominalLoan),
            nominal_installment: String(item.nominalInstallment),
            loan_period: `${item.loanPeriod} bulan`, // TODO: Update when API provides remaining installments
            loan_status_name: item.loanStatusName as any,
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
        setPage,
        setPageSize,
        setSearch,
        setSort,
        navigate,
    };
};
