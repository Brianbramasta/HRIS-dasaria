
import { useEffect, useMemo, useState } from "react";
import InputField from "@/components/shared/field/InputField";
import DateField from "@/components/shared/field/DateField";
import ModalAddEdit from "@/components/shared/modal/ModalAddEdit";
import type { FieldDescriptor, InfoModalProps } from "@/features/payroll/components/layouts/LayoutDetail";
import { useApiPayrollPeriod } from "@/features/payroll/hooks/api/useApiPayrollPeriod";
import { useParams } from "react-router-dom";
import { formatInputCurrency } from "@/utils/formatCurrency";

export default function EditInformationEmployeeModal({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  fields,
  onRefresh,
}: InfoModalProps & { onRefresh?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const { id: payrollId } = useParams();
  const { updateWorkingDays } = useApiPayrollPeriod();

  useEffect(() => {
    if (!isOpen) return;
    setValues(defaultValues ?? {});
  }, [defaultValues, isOpen]);

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const isCurrencyField = (field: FieldDescriptor) => {
    const name = (field.name ?? "").toLowerCase();
    return (
      name.includes("nominal") ||
      name.includes("amount") ||
      name.includes("gaji") ||
      name.includes("tunjangan") ||
      name.includes("potongan") ||
      name.includes("total") ||
      name.includes("fee") ||
      name.includes("komisi") ||
      name.includes("insentif") ||
      name.includes("kasbon")
    );
  };

  const renderField = (field: FieldDescriptor) => {
    const colClass = field.colSpan ? `md:col-span-${field.colSpan}` : "";
    const currentVal = values[field.name] ?? (field.value as any) ?? "";

    switch (field.type) {
      case "input":
        return (
          <div key={field.name} className={colClass}>
            <InputField
              label={field.label}
              placeholder={field.placeholder ?? "Inputan"}
              value={isCurrencyField(field) ? formatInputCurrency(String(currentVal ?? "")) : currentVal}
              type={field.inputType ?? "text"}
              readonly={field.readonly}
              disabled={field.readonly}
              onChange={(e) =>
                setValue(field.name, isCurrencyField(field) ? formatInputCurrency(e.target.value) : e.target.value)
              }
            />
          </div>
        );
      case "date":
        return (
          <div key={field.name} className={colClass}>
            <DateField
              label={field.label}
              id={field.id ?? field.name}
              placeholder={field.placeholder ?? "Pilih tanggal"}
              defaultDate={currentVal}
              disabled={field.readonly}
              onChange={(_, dateStr) => setValue(field.name, dateStr ?? "")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const content = useMemo(() => {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        {fields.map((f) => renderField(f))}
      </div>
    );
  }, [fields, values]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (payrollId) {
        const ok = await updateWorkingDays({ payrollId, workingDays: values.jumlahHariKerja ?? "" });
        if (!ok) return;
      }
      onSave(values);
      onClose();
      // Refresh payroll detail data
      onRefresh?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Informasi Karyawan"
      titleAlign="center"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-2xl"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
}

