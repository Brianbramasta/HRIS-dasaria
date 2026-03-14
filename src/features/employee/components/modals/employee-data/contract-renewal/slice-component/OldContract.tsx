import PayrollCard from "@/features/payroll/components/cards/Cards";
import InputField from "@/components/shared/field/InputField";
import {
  formatCurrency,
  formatInputCurrency,
  parseCurrency,
} from "@/utils/formatCurrency";
import { useOldContract } from "@/features/employee/hooks/modals/contract-renewal/slice-component/useOldContract";
import SelectField from "@/components/shared/field/SelectField";

interface OldContractData {
  change_type_name?: string;
  company_name?: string;
  office_name?: string;
  directorate_name?: string;
  division_name?: string;
  department_name?: string;
  unit_name?: string;
  position_name?: string;
  job_title_name?: string;
  structural_position_name?: string;
  position_level_name?: string;
  grade?: string;
  basic_salary?: string | number;
  employee_category_name?: string;
  old_contract_document?: string;
  // Salary components
  gaji_pokok?: string | number;
  tunjangan_pernikahan?: string | number;
  tunjangan_jabatan?: string | number;
  tunjangan_lama_kerja?: string | number;
  tunjangan_diskresi?: Array<{
    id: string;
    amount: number;
    allowance_name: string;
  }>;
  gaji_bersih?: string | number;
}

interface OldContractProps {
  data?: OldContractData;
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
}

export default function OldContract({
  data = {},
  isEditing = false,
  onChange,
}: OldContractProps) {
  const { handleInputChange, isNonStaffOrMitraCategory, salaryLabel } =
    useOldContract({ data, isEditing, onChange, kategoriKaryawanOptions: [] });
  const tunjanganDiskresi = data?.tunjangan_diskresi ?? [];

  return (
    <PayrollCard title="Kontrak Lama" headerColor="green" border={false}>
      <div className="space-y-6">
        {/* Row 1: Kategori Karyawan, Perusahaan, Kantor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Kategori Karyawan"
            value={data?.employee_category_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("employee_category_name", e.target.value)
            }
            containerClassName="space-y-2"
          />
          <InputField
            label="Perusahaan"
            value={data?.company_name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("company_name", e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Kantor"
            value={data?.office_name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("office_name", e.target.value)}
            containerClassName="space-y-2"
          />

          {/* Row 2: Direktorat, Divisi, Departemen */}
          <InputField
            label="Direktorat"
            value={data?.directorate_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("directorate_name", e.target.value)
            }
            containerClassName="space-y-2"
          />
          <InputField
            label="Divisi"
            value={data?.division_name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("division_name", e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Departemen"
            value={data?.department_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("department_name", e.target.value)
            }
            containerClassName="space-y-2"
          />

          {/* Row 3: Unit, Position, Jabatan Kepangkatan */}
          <InputField
            label="Unit"
            value={data?.unit_name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("unit_name", e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Position"
            value={data?.position_name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("position_name", e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="Jabatan Kepangkatan"
            value={data?.job_title_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("job_title_name", e.target.value)
            }
            containerClassName="space-y-2"
          />

          {/* Row 4: Jabatan Struktural, Jenjang Jabatan, Golongan */}
          <InputField
            label="Jabatan Struktural"
            value={data?.structural_position_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("structural_position_name", e.target.value)
            }
            containerClassName="space-y-2"
          />
          <InputField
            label="Jenjang Jabatan"
            value={data?.position_level_name || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("position_level_name", e.target.value)
            }
            containerClassName="space-y-2"
          />
          <InputField
            label="Golongan"
            value={data?.grade || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("grade", e.target.value)}
            containerClassName="space-y-2"
          />

          {/* Row 5: Gaji Pokok, Tunjangan Pernikahan */}
          <InputField
            label={salaryLabel}
            type="text"
            value={formatInputCurrency(String(data?.gaji_pokok || ""))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, "");
              handleInputChange("gaji_pokok", cleaned);
            }}
            containerClassName="space-y-2"
          />
          {!isNonStaffOrMitraCategory && (
            <InputField
              label="Tunjangan Pernikahan"
              type="text"
              value={formatInputCurrency(
                String(data?.tunjangan_pernikahan || ""),
              )}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                handleInputChange("tunjangan_pernikahan", cleaned);
              }}
              containerClassName="space-y-2"
            />
          )}

          {/* Row 6: Tunjangan Jabatan, Tunjangan Lama Kerja */}
          {!isNonStaffOrMitraCategory && (
            <InputField
              label="Tunjangan Jabatan"
              type="text"
              value={formatInputCurrency(String(data?.tunjangan_jabatan || ""))}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                handleInputChange("tunjangan_jabatan", cleaned);
              }}
              containerClassName="space-y-2"
            />
          )}
          {!isNonStaffOrMitraCategory && (
            <InputField
              label="Tunjangan Lama Kerja"
              type="text"
              value={formatInputCurrency(
                String(data?.tunjangan_lama_kerja || ""),
              )}
              disabled={!isEditing}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                handleInputChange("tunjangan_lama_kerja", cleaned);
              }}
              containerClassName="space-y-2"
            />
          )}

          {/* Row 7: Tunjangan Diskresi (Dynamic) */}
          {
            <div className="md:col-span-2">
              <div className="space-y-4">
                {tunjanganDiskresi.map((allowance, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                  >
                    <div className="md:col-span-6">
                      <SelectField
                        label="Tunjangan Diskresi"
                        options={tunjanganDiskresi.map((item) => ({
                          label: item.allowance_name,
                          value: item.allowance_name, // gunakan allowance_name sebagai value
                        }))}
                        defaultValue={allowance.allowance_name} // selected juga allowance_name
                        onChange={(value) =>
                          handleInputChange(
                            `tunjangan_diskresi.${index}.allowance_name`,
                            value,
                          )
                        }
                        placeholder="Pilih Tunjangan Tidak Tetap"
                        disabled={!isEditing}
                        containerClassName="space-y-2"
                      />
                    </div>
                    <div className="md:col-span-6 flex items-end gap-2">
                      <div className="flex-1">
                        <InputField
                          label="Nominal"
                          value={formatCurrency(Number(allowance.amount) || 0)}
                          onChange={(e) =>
                            handleInputChange(
                              `tunjangan_diskresi.${index}.amount`,
                              parseCurrency(e.target.value) || 0,
                            )
                          }
                          placeholder="Rp 0"
                          disabled={!isEditing}
                          containerClassName="space-y-2"
                        />
                      </div>
                    </div>
                  </div>
                )) ?? <></>}
              </div>
            </div>
          }

          {/* Row 8: Gaji Bersih (full width) */}
          <InputField
            label="Gaji Bersih"
            type="text"
            value={formatInputCurrency(String(data?.gaji_bersih || ""))}
            disabled={!isEditing}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, "");
              handleInputChange("gaji_bersih", cleaned);
            }}
            containerClassName="space-y-2"
          />
        </div>
      </div>
    </PayrollCard>
  );
}
