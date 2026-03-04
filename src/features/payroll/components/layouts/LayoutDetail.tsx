// Dokumentasi: Komponen dinamis layout halaman Detail Gaji untuk berbagai tipe (AE, Non-AE, PKL, THR)
import { useState } from "react";
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
import { formatCurrencyValue, parseCurrency } from "@/utils/formatCurrency";
import PayrollApprovalModal from "../modals/payroll-period-approval/PayrollApprovalModal";
import { useApiPayrollPeriodDirectorHr } from "@/features/payroll/hooks/api/useApiPayrollPeriodDirectorHr";
import { useApiPayrollPeriodFat } from "@/features/payroll/hooks/api/useApiPayrollPeriodFat";
import { useApiPayrollPeriodBod } from "@/features/payroll/hooks/api/useApiPayrollPeriodBod";

export type FieldType = "input" | "date" | "select" | "multi-select" | "file";
export type FieldDescriptor = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
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
  fields?: FieldDescriptor[];
  onRefresh?: () => void;
};

export type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  fields: FieldDescriptor[];
  onRefresh?: () => void;
};

export type RekapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  fields: FieldDescriptor[];
  catatanKaryawan?: boolean;
  catatanBOD?: boolean;
  onRefresh?: () => void;
};

type HeaderColor = "gray" | "green" | "red" | "slate" | "blue";

export type SectionConfig = {
  infoFields: FieldDescriptor[];
  infoCard?: {
    title?: string;
    headerColor?: HeaderColor;
  };
  info?: {
    fields: FieldDescriptor[];
    modalFields?: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<InfoModalProps>;
  };
  infoModal?: {
    initialValues?: Record<string, string>;
    modalFields?: FieldDescriptor[];
    ModalComponent?: React.ComponentType<InfoModalProps>;
  };
  tunjanganTetap?:
    | boolean
    | {
        title?: string;
        headerColor?: HeaderColor;
        fields: FieldDescriptor[];
      };
  tunjanganTidakTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
    modalFields?: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
  };
  potonganTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
  };
  potonganTidakTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
    modalFields?: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
  };
  rekapitulasi?:
    | boolean
    | {
        title?: string;
        headerColor?: HeaderColor;
        fields?: FieldDescriptor[];
        modalFields?: FieldDescriptor[];
        initialValues?: Record<string, string>;
        ModalComponent?: React.ComponentType<RekapModalProps>;
        catatanKaryawan?: boolean;
        catatanBOD?: boolean;
      };
  catatanKaryawan?: boolean;
  catatanBOD?: boolean;
};

// Dokumentasi: Komponen utama layout detail, menerima konfigurasi section & modal
export default function DetailPayrollContent({ config, onRefresh, payrollData }: { config: SectionConfig; onRefresh?: () => void; payrollData?: any }) {
  const {
    goBack,
    isApprovalContext,
    isDistribusiContext,
    isFATApproval,
    isHRGAorBODApproval,
    canEditInfo,
    canEditTT,
    canEditPTT,
    canEditRecap,
    canShowApprovalButton,
    infoValues,
    setInfoValues,
    isInfoModalOpen,
    setIsInfoModalOpen,
    recapValues,
    setRecapValues,
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
  } = useLayoutDetail(config, payrollData);
  console.log("payrollData", payrollData);
  // Approval hooks
  const { approvalDirectorHr } = useApiPayrollPeriodDirectorHr();
  const { approvalFat } = useApiPayrollPeriodFat();
  const { approvalBod } = useApiPayrollPeriodBod();

  // Approval modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproval = async () => {
    if (!payrollData?.information_employee?.payroll_id) return;
    
    setIsSubmitting(true);
    try {
      let result = false;
      const payrollId = payrollData.information_employee.payroll_id;

      if (isFATApproval) {
        result = await approvalFat({ payrollIds: [payrollId] });
      } else if (isHRGAorBODApproval) {
        // Check if it's HRGA or BOD based on current status
        const currentStatus = payrollData?.information_employee?.payroll_status_name?.toLowerCase() || '';
        if (currentStatus.includes('direktur hrga')) {
          result = await approvalDirectorHr({ payrollIds: [payrollId] });
        } else if (currentStatus.includes('bod')) {
          result = await approvalBod({ payrollIds: [payrollId] });
        }
      }

      if (result) {
        setIsApprovalModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoTitle = config.infoCard?.title ?? "Informasi Karyawan";
  const infoHeaderColor = config.infoCard?.headerColor ?? "gray";

  const recapConfig =
    config.rekapitulasi && typeof config.rekapitulasi === "object" ? config.rekapitulasi : undefined;
  const recapTitle = recapConfig?.title ?? "REKAPITULASI";
  const recapHeaderColor = recapConfig?.headerColor ?? "slate";
  const recapFields: FieldDescriptor[] =
    recapConfig?.fields ?? [
      { name: "totalPendapatanKotor", label: "Total Pendapatan Kotor", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "totalPotongan", label: "Total Potongan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true },
    ];

  const recapModalFields: FieldDescriptor[] = recapConfig?.modalFields ?? recapFields;

  const recapCatatanKaryawan = recapConfig?.catatanKaryawan ?? config.catatanKaryawan;
  const recapCatatanBOD = recapConfig?.catatanBOD ?? config.catatanBOD;

  const RekapModalComponent = recapConfig?.ModalComponent ?? RecapModall;

  const infoConfig = config.info;
  const infoFields = infoConfig?.fields ?? config.infoFields;
  const InfoModalComponent = infoConfig?.ModalComponent ?? config.infoModal?.ModalComponent;
  const infoModalFields = infoConfig?.modalFields ?? config.infoModal?.modalFields ?? infoFields;

  const tunjanganTetapConfig =
    config.tunjanganTetap && typeof config.tunjanganTetap === "object" ? config.tunjanganTetap : undefined;

  const tunjanganTetapTitle = tunjanganTetapConfig?.title ?? "Tunjangan Tetap";
  const tunjanganTetapHeaderColor = tunjanganTetapConfig?.headerColor ?? "green";

  const tunjanganTidakTetapTitle = config.tunjanganTidakTetap?.title ?? "Tunjangan Tidak Tetap";
  const tunjanganTidakTetapHeaderColor = config.tunjanganTidakTetap?.headerColor ?? "green";

  const potonganTetapTitle = config.potonganTetap?.title ?? "Potongan Tetap";
  const potonganTetapHeaderColor = config.potonganTetap?.headerColor ?? "red";

  const potonganTidakTetapTitle = config.potonganTidakTetap?.title ?? "Potongan Tidak Tetap";
  const potonganTidakTetapHeaderColor = config.potonganTidakTetap?.headerColor ?? "red";

  const defaultTunjanganTetapFields: FieldDescriptor[] = [
    { name: "bpjsJkk", label: "BPJS Ketenagakerjaan JKK (0,24%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJkm", label: "BPJS Ketenagakerjaan JKM (0,30%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJht", label: "BPJS Ketenagakerjaan JHT (3,7%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJkn", label: "BPJS Kesehatan JKN (2%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganJabatan", label: "Tunjangan Jabatan", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganPernikahan", label: "Tunjangan Pernikahan", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganLamaKerja", label: "Tunjangan Lama Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganTransportasi", label: "Tunjangan Transportasi", type: "input", placeholder: "Otomatis", readonly: true },
  ];

  const tunjanganTetapFields: FieldDescriptor[] = tunjanganTetapConfig?.fields ?? defaultTunjanganTetapFields;

  const isCurrencyField = (field: FieldDescriptor) => {
    const name = (field.name ?? "").toLowerCase();
    return (
      name.includes("gaji") ||
      name.includes("tunjangan") ||
      name.includes("bpjs") ||
      name.includes("potongan") ||
      name.includes("total") ||
      name.includes("fee") ||
      name.includes("komisi") ||
      name.includes("insentif") ||
      name.includes("kasbon") ||
      name.startsWith("nfa_") ||
      name.startsWith("nfd_")
    );
  };

  const formatInputValue = (field: FieldDescriptor) => {
    if (field.type !== "input") return field.value;
    if (!isCurrencyField(field)) return field.value;

    if (field.value === null || field.value === undefined || field.value === "") return "-";
    if (typeof field.value === "number") return formatCurrencyValue(field.value);

    const parsed = parseCurrency(String(field.value));
    return formatCurrencyValue(parsed);
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
              value={formatInputValue(field)}
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
              defaultDate={field.value}
              disabled={field.readonly}
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
      <PayrollCard title={infoTitle} headerColor={infoHeaderColor}>
        <div className={gridColsInfo}>
          {infoFields.map((f) => renderField({ ...f, value: infoValues[f.name] ?? f.value }))}
        </div>
        {!!InfoModalComponent && canEditInfo && (
          <div className="w-full flex justify-end">
            <Button
              size="sm"
              variant="custom"
              className="bg-blue-600 text-white"
              onClick={() => setIsInfoModalOpen(true)}
            >
              <Edit3 color="white" />
              Edit
            </Button>
          </div>
        )}
      </PayrollCard>

      {/* Tunjangan Tetap */}
      {config.tunjanganTetap && (
        <PayrollCard title={tunjanganTetapTitle} headerColor={tunjanganTetapHeaderColor}>
          <div className={gridColsTT}>
            {tunjanganTetapFields.map((f) =>
              (() => {
                const rawValue = infoValues[f.name] ?? (f as any).value;

                return renderField({
                  ...f,
                  type: "input",
                  placeholder: f.placeholder ?? "Otomatis",
                  readonly: f.readonly ?? true,
                  value: formatCurrencyValue(
                    typeof rawValue === "number" ? rawValue : parseCurrency(String(rawValue ?? ""))
                  ),
                });
              })()
            )}
          </div>
        </PayrollCard>
      )}

      {/* Tunjangan Tidak Tetap */}
      {config.tunjanganTidakTetap && (
        <PayrollCard title={tunjanganTidakTetapTitle} headerColor={tunjanganTidakTetapHeaderColor}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {config.tunjanganTidakTetap.fields.map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Inputan"}
                value={formatInputValue({ ...f, value: ttValues[f.name] ?? "" })}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit jika HRGA/BOD approval atau Distribusi (FAT tidak bisa edit Tunjangan Tidak Tetap) */}
          {canEditTT && (isHRGAorBODApproval || isDistribusiContext) && (
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
        <PayrollCard title={potonganTetapTitle} headerColor={potonganTetapHeaderColor}>
          <div className={gridColsPTT}>
            {config.potonganTetap.fields.map((f) => (
              <div key={f.name} className={f.colSpan ? `md:col-span-${f.colSpan}` : ""}>
                {f.type === "input" ? (
                  <InputField
                    label={f.label}
                    placeholder={f.placeholder ?? "Inputan"}
                    value={formatCurrencyValue(
                      (() => {
                        const rawValue = infoValues[f.name] ?? (f as any).value;
                        return typeof rawValue === "number" ? rawValue : parseCurrency(String(rawValue ?? ""));
                      })()
                    )}
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
        <PayrollCard title={potonganTidakTetapTitle} headerColor={potonganTidakTetapHeaderColor}>
          <div className={gridColsPTT}>
            {config.potonganTidakTetap.fields.map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Otomatis"}
                value={formatInputValue({ ...f, value: pttValues[f.name] ?? "" })}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit hanya jika FAT approval atau Distribusi */}
          {canEditPTT && (isFATApproval || isDistribusiContext) && (
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
        <PayrollCard title={recapTitle} headerColor={recapHeaderColor}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recapFields.map((f) =>
              renderField({
                ...f,
                value: recapValues[f.name] ?? f.value,
              })
            )}
          </div>
          <div className="space-y-4 mt-6">
            {recapCatatanKaryawan && (
              <TextAreaField
                label="Catatan Karyawan"
                placeholder="Detail Catatan..."
                rows={4}
                value={recapValues.note_hr ?? ""}
                readonly
              />
            )}
            {recapCatatanBOD && (
              <TextAreaField
                label="Catatan BOD"
                placeholder="Detail Catatan..."
                rows={4}
                value={recapValues.note_bod ?? ""}
                readonly
              />
            )}
          </div>
          {/* Dokumentasi: Tombol Edit di bagian bawah sesuai screenshot */}
          {canEditRecap && (
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
          )}
        </PayrollCard>
      )}



      {config.rekapitulasi && (
        <RekapModalComponent
          isOpen={isRecapModalOpen}
          onClose={() => setIsRecapModalOpen(false)}
          defaultValues={recapValues}
          onSave={(values: Record<string, string>) => setRecapValues(values)}
          fields={recapModalFields}
          catatanKaryawan={recapCatatanKaryawan}
          catatanBOD={recapCatatanBOD}
          onRefresh={onRefresh}
        />
      )}

      {/* Dokumentasi: Modal Tunjangan Tidak Tetap bila disediakan */}
      {InfoModalComponent && (
        <InfoModalComponent
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          defaultValues={infoValues}
          onSave={(values) => setInfoValues(values)}
          fields={infoModalFields}
          onRefresh={onRefresh}
        />
      )}
      {config.tunjanganTidakTetap?.ModalComponent && (
        <config.tunjanganTidakTetap.ModalComponent
          isOpen={isTTModalOpen}
          onClose={() => setIsTTModalOpen(false)}
          defaultValues={ttValues}
          onSave={(values) => setTtValues(values)}
          fields={config.tunjanganTidakTetap.modalFields ?? config.tunjanganTidakTetap.fields}
          onRefresh={onRefresh}
        />
      )}
      {/* Dokumentasi: Modal Potongan Tidak Tetap bila disediakan */}
      {config.potonganTidakTetap?.ModalComponent && (
        <config.potonganTidakTetap.ModalComponent
          isOpen={isPTTModalOpen}
          onClose={() => setIsPTTModalOpen(false)}
          defaultValues={pttValues}
          onSave={(values) => setPttValues(values)}
          fields={config.potonganTidakTetap.modalFields ?? config.potonganTidakTetap.fields}
          onRefresh={onRefresh}
        />
      )}

      {/* Dokumentasi: Tombol aksi Approve/Reject hanya saat akses dari Approval Periode Gajian dan status sesuai */}
      {isApprovalContext && canShowApprovalButton && (
        <div className="w-full flex justify-end gap-3 mt-6">
          {/* <Button size="sm" variant="custom" className="bg-red-600 text-white">
            Ditolak
          </Button> */}
          <Button 
            size="sm" 
            variant="custom" 
            className="bg-green-600 text-white"
            onClick={() => setIsApprovalModalOpen(true)}
          >
            {/* Disetujui */}
            Setuju
          </Button>
        </div>
      )}

      {/* Approval Modal */}
      <PayrollApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApproval}
        submitting={isSubmitting}
        statusPersetujuan={payrollData?.current?.periode?.status_payroll || ''}
        periodDate={payrollData?.information_employee?.periode || ''}
      />
    </div>
  );
}
