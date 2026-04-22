import { useEffect, useMemo, useState, useCallback } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';

export const useCashAdvanceHistory = () => {
    const navigate = useNavigate();
    const api = useApiCashAdvance();
    const {
        fetchCashAdvances,
        cashAdvances,
        page,
        pageSize,
        setPage,
        setPageSize,
        setSearch,
        setSort,
        columnFilters,
        dateRangeFilters,
        setColumnFilters,
        setDateRangeFilters,
    } = api;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const submissionModal = useModal(false);
    const shareModal = useModal(false);

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
        setColumnFilters({
            ...columnFilters,
            [columnId]: values,
        });
    }, [columnFilters, setColumnFilters]);

    const rows = useMemo(() => {
        return cashAdvances.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            employee_id: item.employeeId,
            full_name: item.fullName,
            email: item.email,
            national_id: item.nationalId,
            loan_id: item.loanId,
            avatar: item.avatar,
            application_date: item.applicationDate,
            position_name: item.positionName,
            department_name: item.departmentName,
            deduction_start_period: item.deductionStartPeriod || '',
            disbursed_at: item.disbursedAt || '',
            loan_type_name: item.loanTypeName,
            nominal_loan: String(item.nominalLoan),
            nominal_installment: String(item.nominalInstallment),
            loan_period: `${item.loanPeriod} bulan`,
            loan_status_name: item.loanStatus as any,
            rejection_reason: item.rejectionReason || '',
            raw: item,
        }));
    }, [cashAdvances, page, pageSize]);

    return {
        rows,
        loading: api.loading,
        total: api.total,
        page: api.page,
        pageSize: api.pageSize,
        setPage,
        setPageSize,
        setSearch,
        setSort,
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
