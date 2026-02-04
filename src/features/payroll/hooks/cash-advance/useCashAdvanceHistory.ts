import { useEffect, useMemo, useState } from 'react';
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
    } = api;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const submissionModal = useModal(false);
    const shareModal = useModal(false);

    useEffect(() => {
        fetchCashAdvances();
    }, [fetchCashAdvances]);

    const handleOpenShare = () => {
        shareModal.openModal();
    };

    const handleOpenFormKasbon = () => {
        submissionModal.closeModal();
        navigate('/cash-advance/cash-advance-form');
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
            bulanMulaiPotongan: '—',
            tanggalPencairan: item.disbursedAt || '—',
            jenisKasbon: item.loanTypeName,
            nominalKasbon: String(item.nominalLoan),
            nominalCicilan: String(item.nominalInstallment),
            periodeCicilan: `${item.loanPeriod} bulan`,
            statusKasbon: item.loanStatusName as any,
            raw: item,
        }));
    }, [cashAdvances, page, pageSize]);

    return {
        ...api,
        rows,
        isDropdownOpen,
        setIsDropdownOpen,
        submissionModal,
        shareModal,
        handleOpenShare,
        handleOpenFormKasbon,
        navigate,
    };
};
