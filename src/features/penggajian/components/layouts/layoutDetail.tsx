// Dokumentasi: Komponen dinamis layout halaman Detail Gaji untuk berbagai tipe (AE, Non-AE, PKL, THR)
import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import PayrollCard from "@/features/penggajian/components/cards/cards";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import useGoBack from "@/hooks/useGoBack";

export type FieldType = "input" | "date";
export type FieldDescriptor = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  readonly?: boolean;
  value?: string;
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
    showEditButton?: boolean;
  };
  potonganTetap?: {
    fields: FieldDescriptor[];
  };
  potonganTidakTetap?: {
    fields: FieldDescriptor[];
    initialValues?: Record<string, string>;
    ModalComponent?: React.ComponentType<ModalProps>;
    showEditButton?: boolean; // tombol edit tampil saat approval context
  };
  rekapitulasi?: boolean;
  catatan?: boolean;
};

// Dokumentasi: Komponen utama layout detail, menerima konfigurasi section & modal
export default function DetailPayrollContent({ config }: { config: SectionConfig }) {
  const goBack = useGoBack();
  const location = useLocation();
  // Dokumentasi: Deteksi konteks Approval & Distribusi untuk kontrol tombol edit
  const isApprovalContext = location.pathname.startsWith("/approval-periode-gajian");
  const isDistribusiContext = location.pathname.startsWith("/distribusi-gaji");

  const [ttValues, setTtValues] = useState<Record<string, string>>(
    () => config.tunjanganTidakTetap?.initialValues ?? {}
  );
  const [pttValues, setPttValues] = useState<Record<string, string>>(
    () => config.potonganTidakTetap?.initialValues ?? {}
  );
  const [isTTModalOpen, setIsTTModalOpen] = useState(false);
  const [isPTTModalOpen, setIsPTTModalOpen] = useState(false);

  const gridColsInfo = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);
  const gridColsTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", []);
  const gridColsPTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);

  const renderField = (field: FieldDescriptor) => {
    const colClass = field.colSpan ? `md:col-span-${field.colSpan}` : "";
    const common = (
      <div className={colClass}>
        <Label>{field.label}</Label>
        {field.type === "input" ? (
          <Input
            placeholder={field.placeholder ?? "Inputan"}
            value={field.value}
            type={field.inputType ?? "text"}
            readonly={field.readonly}
          />
        ) : (
          <DatePicker id={field.id ?? field.name} placeholder={field.placeholder ?? "Pilih tanggal"} />
        )}
      </div>
    );
    return common;
  };

  return (
    <div className="space-y-6">
      {/* Header dan tombol kembali */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
        >
          ◀ Kembali
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Gaji</h2>

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
            <div>
              <Label>BPJS Ketenagakerjaan JKK (0,24%)</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>BPJS Ketenagakerjaan JKM (0,30%)</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>BPJS Ketenagakerjaan JHT (3,7%)</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>BPJS Kesehatan JKN (2%)</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Tunjangan Jabatan</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Tunjangan Pernikahan</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Tunjangan Lama Kerja</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Tunjangan Transportasi</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
          </div>
        </PayrollCard>
      )}

      {/* Tunjangan Tidak Tetap */}
      {config.tunjanganTidakTetap && (
        <PayrollCard title="Tunjangan Tidak Tetap" headerColor="green">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {config.tunjanganTidakTetap.fields.map((f) => (
              <div key={f.name}>
                <Label>{f.label}</Label>
                <Input placeholder={f.placeholder ?? "Inputan"} value={ttValues[f.name] ?? ""} readonly />
              </div>
            ))}
          </div>
          {(config.tunjanganTidakTetap.showEditButton || isDistribusiContext) && (
            <div className="w-full flex justify-end">
              <Button
                size="sm"
                variant="custom"
                className="bg-blue-600 text-white"
                onClick={() => setIsTTModalOpen(true)}
              >
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
                <Label>{f.label}</Label>
                {f.type === "input" ? (
                  <Input placeholder={f.placeholder ?? "Inputan"} type={f.inputType ?? "text"} readonly={f.readonly} />
                ) : (
                  <DatePicker id={f.id ?? f.name} placeholder={f.placeholder ?? "Pilih tanggal"} />
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
              <div key={f.name}>
                <Label>{f.label}</Label>
                <Input placeholder={f.placeholder ?? "Otomatis"} value={pttValues[f.name] ?? ""} readonly />
              </div>
            ))}
          </div>
          {config.potonganTidakTetap.showEditButton && (isApprovalContext || isDistribusiContext) && (
            <div className="w-full flex justify-end">
              <Button
                size="sm"
                variant="custom"
                className="bg-blue-600 text-white"
                onClick={() => setIsPTTModalOpen(true)}
              >
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
            <div>
              <Label>Total Pendapatan Kotor</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Total Potongan</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
            <div>
              <Label>Gaji Bersih</Label>
              <Input placeholder="Otomatis" readonly />
            </div>
          </div>
          {config.catatan && (
            <div className="mt-6">
              <Label>Catatan</Label>
              <TextArea placeholder="Detail Catatan..." rows={4} />
            </div>
          )}
        </PayrollCard>
      )}

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
