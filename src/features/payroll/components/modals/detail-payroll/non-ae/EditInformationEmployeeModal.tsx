
import { useEffect, useMemo, useState } from "react";
import InputField from "@/components/shared/field/InputField";
import DateField from "@/components/shared/field/DateField";
import ModalAddEdit from "@/components/shared/modal/ModalAddEdit";
import type { FieldDescriptor, InfoModalProps } from "@/features/payroll/components/layouts/LayoutDetail";

export default function EditInformationEmployeeModal({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  fields,
}: InfoModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setValues(defaultValues ?? {});
  }, [defaultValues, isOpen]);

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
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
              value={currentVal}
              type={field.inputType ?? "text"}
              readonly={field.readonly}
              disabled={field.readonly}
              onChange={(e) => setValue(field.name, e.target.value)}
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
      onSave(values);
      onClose();
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

