import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useEditFeeModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditFeeModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: any;
    onSave: (values: { amount: number }) => void;
    isLoading?: boolean;
}

const EditFeeModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, isLoading }) => {
    const { form, setField, handleSubmit } = useEditFeeModal({
        defaultValues,
        onSave,
        onClose,
    });

    const content = (
        <div className="space-y-5">
            <div>
                <InputField
                    label="Nama FEE"
                    placeholder="Nama FEE"
                    value={form.namaFee}
                    onChange={(e) => setField('namaFee', e.target.value)}
                    disabled
                    className="bg-gray-100"
                />
            </div>
            <div>
                <InputField
                    label="Nominal"
                    placeholder="edit Nominal"
                    value={form.nominal}
                    onChange={(e) => setField('nominal', e.target.value)}
                    required
                />
            </div>
        </div>
    );

    return (
        <ModalAddEdit
            title={'Edit FEE'}
            isOpen={isOpen}
            onClose={onClose}
            content={content}
            handleSubmit={handleSubmit}
            submitting={isLoading ?? false}
            maxWidth="max-w-lg"
            confirmTitleButton="Simpan Perubahan"
            closeTitleButton="Tutup"
        />
    );
};

export default EditFeeModal;
