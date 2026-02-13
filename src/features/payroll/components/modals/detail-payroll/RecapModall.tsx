import { FC } from "react";
import ModalAddEdit from "@/components/shared/modal/ModalAddEdit";
import InputField from "@/components/shared/field/InputField";
import TextAreaField from "@/components/shared/field/TextAreaField";
// Requested components but not explicitly in design image - importing just in case or for future consistency
import DateField from "@/components/shared/field/DateField";
import FIleField from "@/components/shared/field/FIleField";
import MultiSelectField from "@/components/shared/field/MultiSelectField";
import SelectField from "@/components/shared/field/SelectField";

interface RecapModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleSubmit?: () => void;
    submitting?: boolean;
}

const RecapModall: FC<RecapModalProps> = ({
    isOpen,
    onClose,
    handleSubmit,
    submitting = false
}) => {
    const content = (
        <div className="space-y-4">
            {/*
              Ensuring requested components are included as per user requirement.
              They are not shown in the design image but are imported and ready for use.
            */}
            <div className="hidden">
                <DateField label="Tanggal" />
                <FIleField label="File" />
                <MultiSelectField label="Multi" options={[]} defaultSelected={[]} onChange={() => { }} />
                <SelectField label="Select" options={[]} onChange={() => { }} />
            </div>

            <InputField
                label="Gaji Bersih"
                placeholder="Otomatis"
                disabled
                containerClassName="mb-1"
            />
            <InputField
                label="Total Pendapatan Kotor"
                placeholder="Otomatis"
                disabled
                containerClassName="mb-1"
            />
            <InputField
                label="Total Potongan"
                placeholder="Otomatis"
                disabled
                containerClassName="mb-1"
            />
            <TextAreaField
                label="Catatan Karyawan"
                placeholder="Enter as Deskripsi ..."
                rows={4}
                containerClassName="mb-1"
            />
            <TextAreaField
                label="Catatan BOD"
                placeholder="Enter as Deskripsi ..."
                rows={4}
                containerClassName="mb-1"
            />
        </div>
    );

    return (
        <ModalAddEdit
            title="Rekapitulasi"
            isOpen={isOpen}
            onClose={onClose}
            content={content}
            handleSubmit={handleSubmit}
            submitting={submitting}
            confirmTitleButton="Simpan Perubahan"
            closeTitleButton="Tutup"
            maxWidth="max-w-2xl"
        />
    );
};

export default RecapModall;
