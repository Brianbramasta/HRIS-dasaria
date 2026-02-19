import { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import ModalAddEdit from "@/components/shared/modal/ModalAddEdit";
import InputField from "@/components/shared/field/InputField";
import TextAreaField from "@/components/shared/field/TextAreaField";
import DateField from "@/components/shared/field/DateField";
import FIleField from "@/components/shared/field/FIleField";
import MultiSelectField from "@/components/shared/field/MultiSelectField";
import SelectField from "@/components/shared/field/SelectField";
import type { FieldDescriptor, RekapModalProps } from "@/features/payroll/components/layouts/LayoutDetail";
import { useApiPayrollPeriod } from "@/features/payroll/hooks/api/useApiPayrollPeriod";

const RecapModall: FC<RekapModalProps> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  fields,
  catatanKaryawan,
  catatanBOD,
}) => {
  const { id } = useParams();
  const { updateNote } = useApiPayrollPeriod();
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

    switch (field.type) {
      case "input":
        return (
          <div key={field.name} className={colClass}>
            <InputField
              label={field.label}
              placeholder={field.placeholder ?? "Inputan"}
              value={values[field.name] ?? field.value ?? ""}
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
              defaultDate={values[field.name] ?? field.value ?? ""}
              disabled={field.readonly}
              onChange={(_, dateStr) => setValue(field.name, dateStr ?? "")}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.name} className={colClass}>
            <SelectField
              label={field.label}
              options={field.options ?? []}
              placeholder={field.placeholder ?? "Pilih..."}
              defaultValue={values[field.name] ?? field.value ?? ""}
              onChange={(v) => setValue(field.name, String(v ?? ""))}
              disabled={field.readonly}
            />
          </div>
        );
      case "multi-select":
        return (
          <div key={field.name} className={colClass}>
            <MultiSelectField
              label={field.label}
              options={(field.options ?? []).map((o) => ({ value: o.value, text: o.label }))}
              defaultSelected={Array.isArray(values[field.name]) ? (values[field.name] as any) : []}
              onChange={(v) => setValue(field.name, Array.isArray(v) ? v.join(",") : String(v ?? ""))}
              disabled={field.readonly}
            />
          </div>
        );
      case "file":
        return (
          <div key={field.name} className={colClass}>
            <FIleField label={field.label} htmlFor={field.id ?? field.name} />
          </div>
        );
      default:
        return null;
    }
  };

  const content = useMemo(() => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {fields.map((f) => renderField(f))}
        </div>
        {catatanKaryawan && (
          <TextAreaField
            label="Catatan Karyawan"
            placeholder="Detail Catatan..."
            rows={4}
            value={values.note_hr ?? ""}
            onChange={(v) => setValue("note_hr", String(v ?? ""))}
          />
        )}
        {catatanBOD && (
          <TextAreaField
            label="Catatan BOD"
            placeholder="Detail Catatan..."
            rows={4}
            value={values.note_bod ?? ""}
            onChange={(v) => setValue("note_bod", String(v ?? ""))}
          />
        )}
      </div>
    );
  }, [catatanBOD, catatanKaryawan, fields, values]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (id) {
        const ok = await updateNote({
          payrollId: String(id),
          noteHr: values.note_hr,
          noteBod: values.note_bod,
        });
        if (!ok) return;
      }
      onSave(values);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

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
