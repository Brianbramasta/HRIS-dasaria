import { useMemo, useState } from 'react';
import { useModal } from '@/hooks/useModal';

export const useFeeAllowance = () => {
    const editModal = useModal(false);
    const [selected, setSelected] = useState<any | null>(null);

    const feeAllowanceRows = useMemo(() => {
        return [
            {
                id: '1',
                namaFee: 'FEE AE',
                nominal: 1000000,
            },
        ];
    }, []);

    const handleEditOpen = (row: any) => {
        setSelected(row);
        editModal.openModal();
    };

    const handleUpdate = async (values: any) => {
        console.log('Update Fee:', values);
        editModal.closeModal();
    };

    return {
        feeAllowanceRows,
        editModal,
        handleEditOpen,
        handleUpdate,
        selected,
        loading: false,
    };
};
