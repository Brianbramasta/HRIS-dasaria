import { useEffect, useMemo, useState } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { useNavigate } from 'react-router-dom';

type DateRangeFilter = {
    startDate: string;
    endDate: string | null;
};

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
    } = api;

    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, DateRangeFilter>>({});
    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
    const [loans, setLoans] = useState<any[]>([]);

    useEffect(() => {
        const fetchLoans = async () => {
            // TODO: Update this when backend supports filtering for active-and-completed-loans endpoint
            const result = await getActiveAndCompletedLoans();
            if (result) {
                setLoans(result);
            }
        };
        fetchLoans();
    }, [getActiveAndCompletedLoans]);

    const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
        setDateRangeFilters((prev) => ({
            ...prev,
            [columnId]: { startDate, endDate },
        }));
        // TODO: When backend supports date range filtering, call API here
    };

    const handleColumnFilterChange = (columnId: string, values: string[]) => {
        setColumnFilters((prev) => ({
            ...prev,
            [columnId]: values,
        }));
        // TODO: When backend supports column filtering, call API here
    };

    const rows = useMemo(() => {
        return loans.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            idKaryawan: item.employeeId,
            loanId: item.loanId,
            pengguna: item.fullName,
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
