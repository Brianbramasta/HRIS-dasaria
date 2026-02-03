// Dokumentasi: Komponen dinamis layout halaman Detail Gaji untuk berbagai tipe (AE, Non-AE, PKL, THR)
import PayrollCard from "@/features/payroll/components/cards/Cards";
import InputField from "@/components/shared/field/InputField";
import DateField from "@/components/shared/field/DateField";
import TextAreaField from "@/components/shared/field/TextAreaField";
import SelectField from "@/components/shared/field/SelectField";
import MultiSelectField from "@/components/shared/field/MultiSelectField";
import FIleField from "@/components/shared/field/FIleField";
import Button from "@/components/ui/button/Button";
import { ChevronLeft } from "react-feather";
import { IconPencil as Edit3 } from "@/icons/components/icons";
import { useLayoutDetail } from "@/features/payroll/hooks/layouts/useLayoutDetail";
import RecapModall from "@/features/payroll/components/modals/detail-payroll/RecapModall";

export type FieldType = "input" | "date" | "select" | "multi-select" | "file";
export type FieldDescriptor = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  readonly?: boolean;
  value?: string | any;
  inputType?: string;
  colSpan?: 1 | 2 | 3;
  id?: string;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
};

export type SectionConfig = {
  infoFields: FieldDescriptor[];
  tunjanganTetap?: boolean;
  tunjanganTidakTetap?: {
    fields: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
  };
  potonganTetap?: {
    fields: FieldDescriptor[];
  };
  potonganTidakTetap?: {
    fields: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
  };
  rekapitulasi?: boolean;
  catatanKaryawan?: boolean;
  catatanBOD?: boolean;
};

// Dokumentasi: Komponen utama layout detail, menerima konfigurasi section & modal
export default function DetailPayrollContent({ config }: { config: SectionConfig }) {
  const {
    goBack,
    isApprovalContext,
    isDistribusiContext,
    isFATApproval,
    isHRGAorBODApproval,
    ttValues,
    setTtValues,
    pttValues,
    setPttValues,
    isTTModalOpen,
    setIsTTModalOpen,
    isPTTModalOpen,
    setIsPTTModalOpen,
    isRecapModalOpen,
    setIsRecapModalOpen,
    gridColsInfo,
    gridColsTT,
    gridColsPTT,
  } = useLayoutDetail(config);

  const renderField = (field: FieldDescriptor) => {
    const colClass = field.colSpan ? `md:col-span-${field.colSpan}` : "";

    switch (field.type) {
      case "input":
        return (
          <div key={field.name} className={colClass}>
            <InputField
              label={field.label}
              placeholder={field.placeholder ?? "Inputan"}
              value={field.value}
              type={field.inputType ?? "text"}
              readonly={field.readonly}
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
              defaultValue={field.value}
              onChange={() => { }}
              disabled={field.readonly}
            />
          </div>
        );
      case "multi-select":
        return (
          <div key={field.name} className={colClass}>
            <MultiSelectField
              label={field.label}
              options={(field.options ?? []).map(o => ({ value: o.value, text: o.label }))}
              defaultSelected={Array.isArray(field.value) ? field.value : []}
              onChange={() => { }}
              disabled={field.readonly}
            />
          </div>
        );
      case "file":
        return (
          <div key={field.name} className={colClass}>
            <FIleField
              label={field.label}
              htmlFor={field.id ?? field.name}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dan tombol kembali */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Gaji</h2>
      </div>


      {/* Informasi Karyawan */}
      <PayrollCard title="Informasi Karyawan" headerColor="gray">
        <div className={gridColsInfo}>
          {config.infoFields.map((f) => renderField(f))}
        </div>
      </PayrollCard>

      {/* Tunjangan Tetap */}
      {config.tunjanganTetap && (
        <PayrollCard title="Tunjangan Tetap" headerColor="green">
          <div className={gridColsTT}>
            <InputField label="BPJS Ketenagakerjaan JKK (0,24%)" placeholder="Otomatis" readonly />
            <InputField label="BPJS Ketenagakerjaan JKM (0,30%)" placeholder="Otomatis" readonly />
            <InputField label="BPJS Ketenagakerjaan JHT (3,7%)" placeholder="Otomatis" readonly />
            <InputField label="BPJS Kesehatan JKN (2%)" placeholder="Otomatis" readonly />
            <InputField label="Tunjangan Jabatan" placeholder="Otomatis" readonly />
            <InputField label="Tunjangan Pernikahan" placeholder="Otomatis" readonly />
            <InputField label="Tunjangan Lama Kerja" placeholder="Otomatis" readonly />
            <InputField label="Tunjangan Transportasi" placeholder="Otomatis" readonly />
          </div>
        </PayrollCard>
      )}

      {/* Tunjangan Tidak Tetap */}
      {config.tunjanganTidakTetap && (
        <PayrollCard title="Tunjangan Tidak Tetap" headerColor="green">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {config.tunjanganTidakTetap.fields.map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Inputan"}
                value={ttValues[f.name] ?? ""}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit jika FAT atau HRGA/BOD approval atau Distribusi */}
          {(isFATApproval || isHRGAorBODApproval || isDistribusiContext) && (
            <div className="w-full flex justify-end">
              <Button
                size="sm"
                variant="custom"
                className="bg-blue-600 text-white"
                onClick={() => setIsTTModalOpen(true)}
              >
                <Edit3 color="white" />
                Edit
              </Button>
            </div>
          )}
        </PayrollCard>
      )}

      {/* Potongan Tetap */}
      {config.potonganTetap && (
        <PayrollCard title="Potongan Tetap" headerColor="red">
          <div className={gridColsPTT}>
            {config.potonganTetap.fields.map((f) => (
              <div key={f.name} className={f.colSpan ? `md:col-span-${f.colSpan}` : ""}>
                {f.type === "input" ? (
                  <InputField
                    label={f.label}
                    placeholder={f.placeholder ?? "Inputan"}
                    type={f.inputType ?? "text"}
                    readonly={f.readonly}
                  />
                ) : (
                  <DateField
                    label={f.label}
                    id={f.id ?? f.name}
                    placeholder={f.placeholder ?? "Pilih tanggal"}
                  />
                )}
              </div>
            ))}
          </div>
        </PayrollCard>
      )}

      {/* Potongan Tidak Tetap */}
      {config.potonganTidakTetap && (
        <PayrollCard title="Potongan Tidak Tetap" headerColor="red">
          <div className={gridColsPTT}>
            {config.potonganTidakTetap.fields.map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Otomatis"}
                value={pttValues[f.name] ?? ""}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit hanya jika FAT approval atau Distribusi */}
          {(isFATApproval || isDistribusiContext) && (
            <div className="w-full flex justify-end">
              <Button
                size="sm"
                variant="custom"
                className="bg-blue-600 text-white"
                onClick={() => setIsPTTModalOpen(true)}
              >
                <Edit3 color="white" />
                Edit
              </Button>
            </div>
          )}
        </PayrollCard>
      )}

      {/* REKAPITULASI */}
      {config.rekapitulasi && (
        <PayrollCard title="REKAPITULASI" headerColor="slate">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <InputField label="Total Pendapatan Kotor" placeholder="Otomatis" readonly />
            <InputField label="Total Potongan" placeholder="Otomatis" readonly />
            <InputField label="Gaji Bersih" placeholder="Otomatis" readonly />
          </div>
          <div className="space-y-4 mt-6">
            {config.catatanKaryawan && (
              <TextAreaField label="Catatan Karyawan" placeholder="Detail Catatan..." rows={4} />
            )}
            {config.catatanBOD && (
              <TextAreaField label="Catatan BOD" placeholder="Detail Catatan..." rows={4} />
            )}
          </div>
          {/* Dokumentasi: Tombol Edit di bagian bawah sesuai screenshot */}
          <div className="w-full flex justify-end mt-6">
            <Button
              size="md"
              variant="custom"
              className="bg-blue-600 text-white flex items-center gap-2"
              onClick={() => setIsRecapModalOpen(true)}
            >
              <Edit3 color="white" />
              Edit
            </Button>
          </div>
        </PayrollCard>
      )}



      <RecapModall
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
      />

      {/* Dokumentasi: Modal Tunjangan Tidak Tetap bila disediakan */}
      {config.tunjanganTidakTetap?.ModalComponent && (
        <config.tunjanganTidakTetap.ModalComponent
          isOpen={isTTModalOpen}
          onClose={() => setIsTTModalOpen(false)}
          defaultValues={ttValues}
          onSave={(values) => setTtValues(values)}
        />
      )}
      {/* Dokumentasi: Modal Potongan Tidak Tetap bila disediakan */}
      {config.potonganTidakTetap?.ModalComponent && (
        <config.potonganTidakTetap.ModalComponent
          isOpen={isPTTModalOpen}
          onClose={() => setIsPTTModalOpen(false)}
          defaultValues={pttValues}
          onSave={(values) => setPttValues(values)}
        />
      )}

      {/* Dokumentasi: Tombol aksi Approve/Reject hanya saat akses dari Approval Periode Gajian */}
      {isApprovalContext && (
        <div className="w-full flex justify-end gap-3 mt-6">
          <Button size="sm" variant="custom" className="bg-red-600 text-white">
            Ditolak
          </Button>
          <Button size="sm" variant="custom" className="bg-green-600 text-white">
            Disetujui
          </Button>
        </div>
      )}
    </div>
  );
}
