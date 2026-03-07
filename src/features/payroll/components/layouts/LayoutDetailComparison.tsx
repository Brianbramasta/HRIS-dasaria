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
import { useLayoutDetailComparison } from "@/features/payroll/hooks/layouts/useLayoutDetailComparison";
import { formatCurrencyValue } from "@/utils/formatCurrency";
import PayrollApprovalModal from "../modals/payroll-period-approval/PayrollApprovalModal";

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
};

type HeaderColor = "gray" | "green" | "red" | "slate" | "blue";

export type SectionConfig = {
  infoFields: FieldDescriptor[];
  infoCard?: {
    title?: string;
    headerColor?: HeaderColor;
  };
  periodeComparison?: {
    leftTitle?: string;
    rightTitle?: string;
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
        previousFields?: FieldDescriptor[];
      };
  tunjanganTidakTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
    previousFields?: FieldDescriptor[];
    modalFields?: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
  };
  potonganTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
    previousFields?: FieldDescriptor[];
  };
  potonganTidakTetap?: {
    title?: string;
    headerColor?: HeaderColor;
    fields: FieldDescriptor[];
    previousFields?: FieldDescriptor[];
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
        previousValues?: Record<string, string>;
        ModalComponent?: React.ComponentType<RekapModalProps>;
        catatanKaryawan?: boolean;
        catatanBOD?: boolean;
      };
  catatanKaryawan?: boolean;
  catatanBOD?: boolean;
};

// Dokumentasi: Komponen utama layout detail, menerima konfigurasi section & modal
export default function DetailPayrollComparisonContent({ config, payrollData, onRefresh }: { config: SectionConfig; payrollData?: any; onRefresh?: () => void }) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    approvalType,
    isApprovalModalOpen,
    setIsApprovalModalOpen,
    isSubmitting,
    handleApproval,
    infoTitle,
    infoHeaderColor,
    recapTitle,
    recapHeaderColor,
    recapFields,
    recapModalFields,
    recapCatatanKaryawan,
    recapCatatanBOD,
    RekapModalComponent,
    infoFields,
    InfoModalComponent,
    infoModalFields,
    tunjanganTetapTitle,
    tunjanganTetapHeaderColor,
    tunjanganTidakTetapTitle,
    tunjanganTidakTetapHeaderColor,
    potonganTetapTitle,
    potonganTetapHeaderColor,
    potonganTidakTetapTitle,
    potonganTidakTetapHeaderColor,
    tunjanganTetapFields,
    formatInputValue,
  } = useLayoutDetailComparison(config, payrollData, isFATApproval, isHRGAorBODApproval);

  const tunjanganTetapConfig =
    config.tunjanganTetap && typeof config.tunjanganTetap === "object" ? config.tunjanganTetap : undefined;

  const recapConfig =
    config.rekapitulasi && typeof config.rekapitulasi === "object" ? config.rekapitulasi : undefined;

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

  const periodeHeaderColor = config.periodeComparison?.headerColor ?? "gray";
  const periodeLeftTitle = config.periodeComparison?.leftTitle ?? "Periode Bulan Kemarin";
  const periodeRightTitle = config.periodeComparison?.rightTitle ?? "Periode Bulan Ini";

  const renderPayrollSections = ({ hideEdits }: { hideEdits: boolean }) => (
    <>
      {/* Tunjangan Tetap */}
      {config.tunjanganTetap && (
        <PayrollCard title={tunjanganTetapTitle} headerColor={tunjanganTetapHeaderColor} >
          <div className={gridColsTT}>
            {(hideEdits && tunjanganTetapConfig?.previousFields ? tunjanganTetapConfig.previousFields : tunjanganTetapFields).map((f: FieldDescriptor) =>
              renderField({
                ...f,
                type: "input",
                placeholder: f.placeholder ?? "Otomatis",
                readonly: f.readonly ?? true,
                value: formatCurrencyValue(f.value),
              })
            )}
          </div>
        </PayrollCard>
      )}

      {/* Tunjangan Tidak Tetap */}
      {config.tunjanganTidakTetap && (
        <PayrollCard title={tunjanganTidakTetapTitle} headerColor={tunjanganTidakTetapHeaderColor} >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(hideEdits && config.tunjanganTidakTetap.previousFields ? config.tunjanganTidakTetap.previousFields : config.tunjanganTidakTetap.fields).map((f: FieldDescriptor) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Inputan"}
                value={formatCurrencyValue(f.value)}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit jika HRGA/BOD approval atau Distribusi (FAT tidak bisa edit Tunjangan Tidak Tetap) */}
          {!hideEdits && canEditTT && (isHRGAorBODApproval || isDistribusiContext) && (
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
        <PayrollCard title={potonganTetapTitle} headerColor={potonganTetapHeaderColor} >
          <div className={gridColsPTT}>
            {(hideEdits && config.potonganTetap.previousFields ? config.potonganTetap.previousFields : config.potonganTetap.fields).map((f: FieldDescriptor) => (
              <div key={f.name} className={f.colSpan ? `md:col-span-${f.colSpan}` : ""}>
                {f.type === "input" ? (
                  <InputField
                    label={f.label}
                    placeholder={f.placeholder ?? "Inputan"}
                    value={formatCurrencyValue(f.value)}
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
        <PayrollCard title={potonganTidakTetapTitle} headerColor={potonganTidakTetapHeaderColor} >
          <div className={gridColsPTT}>
            {(hideEdits && config.potonganTidakTetap.previousFields ? config.potonganTidakTetap.previousFields : config.potonganTidakTetap.fields).map((f: FieldDescriptor) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder ?? "Otomatis"}
                value={formatCurrencyValue(f.value)}
                readonly
              />
            ))}
          </div>
          {/* Dokumentasi: Tampilkan tombol Edit hanya jika FAT approval atau Distribusi */}
          {!hideEdits && canEditPTT && (isFATApproval || isDistribusiContext) && (
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
        <PayrollCard title={recapTitle} headerColor={recapHeaderColor} >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recapFields.map((f) =>
              renderField({
                ...f,
                value: (hideEdits && recapConfig?.previousValues ? recapConfig.previousValues[f.name] : recapValues[f.name]) ?? f.value,
              })
            )}
          </div>
          <div className="space-y-4 mt-6">
            {recapCatatanKaryawan && (
              <TextAreaField 
                label="Catatan Karyawan" 
                placeholder="Detail Catatan..." 
                rows={4}
                value={hideEdits && recapConfig?.previousValues ? recapConfig.previousValues.note_hr : recapValues.note_hr}
                readonly
              />
            )}
            {recapCatatanBOD && (
              <TextAreaField 
                label="Catatan BOD" 
                placeholder="Detail Catatan..." 
                rows={4}
                value={hideEdits && recapConfig?.previousValues ? recapConfig.previousValues.note_hr : recapValues.note_bod}
                readonly
              />
            )}
          </div>
          {/* Dokumentasi: Tombol Edit di bagian bawah sesuai screenshot */}
          {!hideEdits && canEditRecap && (
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
    </>
  );

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
          {infoFields.map((f: FieldDescriptor) => renderField({ ...f, value: infoValues[f.name] ?? f.value }))}
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

      {config.periodeComparison ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Periode Bulan Kemarin - Cek apakah data previous ada */}
          {payrollData?.previous ? (
            <PayrollCard title={periodeLeftTitle} headerColor={periodeHeaderColor}>
              {renderPayrollSections({ hideEdits: true })}
            </PayrollCard>
          ) : (
            <PayrollCard title={periodeLeftTitle} headerColor={periodeHeaderColor}>
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <p className="text-gray-500 dark:text-gray-400 text-center">Tidak ada Periode.</p>
              </div>
            </PayrollCard>
          )}
          
          {/* Periode Bulan Ini */}
          <PayrollCard title={periodeRightTitle} headerColor={periodeHeaderColor}>
            {renderPayrollSections({ hideEdits: false })}
          </PayrollCard>
        </div>
      ) : (
        renderPayrollSections({ hideEdits: false })
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
        />
      )}

      {/* Dokumentasi: Modal Tunjangan Tidak Tetap bila disediakan */}
      {InfoModalComponent && (
        <InfoModalComponent
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          defaultValues={infoValues}
          onSave={(values: any) => setInfoValues(values)}
          fields={infoModalFields}
          onRefresh={onRefresh}
        />
      )}
      {config.tunjanganTidakTetap?.ModalComponent && (
        <config.tunjanganTidakTetap.ModalComponent
          isOpen={isTTModalOpen}
          onClose={() => setIsTTModalOpen(false)}
          defaultValues={ttValues}
          onSave={(values: any) => setTtValues(values)}
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
          onSave={(values: any) => setPttValues(values)}
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
        approvalType={approvalType}
      />
    </div>
  );
}
