import { useEffect, useMemo, useState } from 'react';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { CashAdvanceListItem } from '../../types/dto/CashAdvanceType';
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';

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



    const rows = useMemo(() => {
        return cashAdvances.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1,
            idKaryawan: item.employeeId,
            pengguna: item.fullName,
            email: item.email,
            nationalId: item.nationalId,
            loanId: item.loanId,
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
        navigate,
    };
};
