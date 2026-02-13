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
            idKaryawan: item.employeeId,
            pengguna: item.fullName,
            email: item.email,
            nationalId: item.nationalId,
            loanId: item.loanId,
            avatar: item.avatar,
            tanggalPengajuan: item.applicationDate,
            posisi: item.positionName,
            departemen: item.departmentName,
            bulanMulaiPotongan: item.deductionStartPeriod || '—',
            tanggalPencairan: item.disbursedAt || '—',
            jenisKasbon: item.loanTypeName,
            nominalKasbon: String(item.nominalLoan),
            nominalCicilan: String(item.nominalInstallment),
            periodeCicilan: `${item.loanPeriod} bulan`,
            statusKasbon: item.loanStatusName as any,
            rejectionReason: item.rejectionReason || '—',
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
