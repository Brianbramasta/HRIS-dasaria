import { useEffect, useMemo, useState, useCallback } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        const fetchLoans = async () => {
            const result = await getActiveAndCompletedLoans();
            if (result) {
                setLoans(result);
            }
        };
        fetchLoans();
    }, [getActiveAndCompletedLoans]);

    // Fetch when filters change
    useEffect(() => {
        const fetchLoans = async () => {
            const result = await getActiveAndCompletedLoans();
            if (result) {
                setLoans(result);
            }
        };
        fetchLoans();
    }, [columnFilters, dateRangeFilters, getActiveAndCompletedLoans]);

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
        setPage,
        setPageSize,
        setSearch,
        setSort,
        navigate,
    };
};
