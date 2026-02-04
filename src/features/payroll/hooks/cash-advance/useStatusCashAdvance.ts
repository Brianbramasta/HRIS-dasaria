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
            idKaryawan: item.employeeId,
            loanId: item.loanId,
            pengguna: item.fullName,
            avatar: item.avatar,
            tanggalPengajuan: item.applicationDate,
            posisi: item.positionName,
            departemen: item.departmentName,
            tanggalMulaiPotongan: item.deductionStartPeriod,
            tanggalPencairan: item.disbursedAt,
            jenisKasbon: item.loanTypeName,
            nominalKasbon: String(item.nominalLoan),
            nominalCicilan: String(item.nominalInstallment),
            sisaPeriodeCicilan: `${item.loanPeriod} bulan`, // TODO: Update when API provides remaining installments
            periodeCicilan: `${item.loanPeriod} bulan`,
            statusKasbon: item.loanStatusName as any,
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
