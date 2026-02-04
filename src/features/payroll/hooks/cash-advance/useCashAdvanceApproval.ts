import { useEffect, useMemo, useState } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { CashAdvanceListItem } from '../../types/dto/CashAdvanceType';
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';

type DateRangeFilter = {
    startDate: string;
    endDate: string | null;
};

export const useCashAdvanceApproval = () => {
    const navigate = useNavigate();
    const api = useApiCashAdvance();
    const {
        fetchCashAdvances,
        cashAdvances,
        page,
        pageSize,
    } = api;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchModal = useModal(false);
    const rejectModal = useModal(false);
    const [selected, setSelected] = useState<CashAdvanceListItem | null>(null);
    const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, DateRangeFilter>>({});
    const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        fetchCashAdvances();
    }, [fetchCashAdvances]);

    const handleApproveOpen = (item: CashAdvanceListItem) => {
        setSelected(item);
        searchModal.openModal();
    };

    const handleRejectOpen = (item: CashAdvanceListItem) => {
        setSelected(item);
        rejectModal.openModal();
    };

    const handleClose = () => {
        setSelected(null);
        searchModal.closeModal();
        rejectModal.closeModal();
    };

    const handleDateRangeFilterChange = (columnId: string, startDate: string, endDate: string | null) => {
        setDateRangeFilters((prev) => ({
            ...prev,
            [columnId]: { startDate, endDate },
        }));
        // TODO: When backend supports date range filtering, call fetchCashAdvances with filter params
    };

    const handleColumnFilterChange = (columnId: string, values: string[]) => {
        setColumnFilters((prev) => ({
            ...prev,
            [columnId]: values,
        }));
        // TODO: When backend supports column filtering, call fetchCashAdvances with filter params
    };

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
        ...api,
        rows,
        isDropdownOpen,
        setIsDropdownOpen,
        searchModal,
        rejectModal,
        selected,
        handleApproveOpen,
        handleRejectOpen,
        handleClose,
        fetchCashAdvances,
        dateRangeFilters,
        columnFilters,
        handleDateRangeFilterChange,
        handleColumnFilterChange,
        navigate,
    };
};
