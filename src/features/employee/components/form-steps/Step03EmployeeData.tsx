import React from 'react';
// import DateField from '../../../../components/shared/field/DateField';
import SelectField from '../../../../components/shared/field/SelectField';
import InputField from '../../../../components/shared/field/InputField';
import { STATUS_PAYROLL_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep3Data } from '../../hooks/employee-data/form/useFromStep';


export const Step03EmployeeData: React.FC = () => {
  const {
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    positionLevelOptions,
    employeeStatusOptions,
    jabatanStrukturalOptions,
    handleChange,
    selectedGrade,
    step3,
    unitOptions,
    visibleFields,
    handleCompanySearch,
    handleOfficeSearch,
    handleDirectorateSearch,
    handleDivisionSearch,
    handleDepartmentSearch,
    handleUnitSearch,
    handleJobTitleSearch,
    handlePositionSearch,
    handlePositionLevelSearch,
    handleEmployeeCategorySearch,
  } = useStep3Data();

  const isEmployeeCategoryNotSelected = !step3.kategoriKaryawan;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Data Karyawan
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
          {/* Baris 1 */}
          <div>
            <SelectField
              label="Kategori Karyawan"
              options={kategoriKaryawanOptions}
              defaultValue={step3.kategoriKaryawan}
              onChange={(value) => {
                handleChange('kategoriKaryawan', value);
                const selectedCategory = kategoriKaryawanOptions.find((opt: any) => opt.value === value);
                if (selectedCategory) {
                  const label = selectedCategory.label;
                  if (['Staff', 'Mitra'].includes(label)) {
                    const statusEvaluasi = employeeStatusOptions.find((opt: any) => opt.label === 'Evaluasi');
                    if (statusEvaluasi) handleChange('employmentStatus', statusEvaluasi.value);
                  } else if (label === 'Non-Staff') {
                    const statusAktif = employeeStatusOptions.find((opt: any) => opt.label === 'Aktif');
                    if (statusAktif) handleChange('employmentStatus', statusAktif.value);
                  }
                }
              }}
              onSearch={handleEmployeeCategorySearch}
              required
            />
          </div>
          <div>
            <SelectField
              label="Status Karyawan"
              options={employeeStatusOptions.filter((status: any) => ['Aktif', 'Evaluasi'].includes(status.label))}
              defaultValue={step3.employmentStatus}
              onChange={(value) => handleChange('employmentStatus', value)}
              required
              disabled={isEmployeeCategoryNotSelected}
            />
          </div>

          {/* Baris 2 */}
          <div>
            <SelectField
              label="Jabatan Kepangkatan"
              options={jobTitleOptions}
              defaultValue={step3.jabatan}
              onChange={(value) => handleChange('jabatan', value)}
              onSearch={handleJobTitleSearch}
              required
              disabled={isEmployeeCategoryNotSelected}
            />
          </div>
          <div>
            <SelectField
              label="Jabatan Struktural"
              options={jabatanStrukturalOptions}
              defaultValue={step3.jabatanStruktural}
              onChange={(value) => handleChange('jabatanStruktural', value)}
              required
              disabled={isEmployeeCategoryNotSelected || !step3.jabatan}
            />
          </div>

          {/* Baris 3 */}
          <div>
            <SelectField
              label="Perusahaan"
              options={companyOptions}
              defaultValue={step3.company}
              onChange={(value) => handleChange('company', value)}
              onSearch={handleCompanySearch}
              required
              disabled={isEmployeeCategoryNotSelected}
            />
          </div>
          <div>
            <SelectField
              label="Kantor"
              options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
              defaultValue={step3.kantor}
              onChange={(value) => handleChange('kantor', value)}
              onSearch={handleOfficeSearch}
              disabled={isEmployeeCategoryNotSelected || officeOptions.length === 0}
              required
            />
          </div>

          {/* Baris 4 (Conditional) */}
          {visibleFields.direktorat && (
            <div>
              <SelectField
                label="Direktorat"
                options={directorateOptions}
                defaultValue={step3.direktorat}
                onChange={(value) => handleChange('direktorat', value)}
                onSearch={handleDirectorateSearch}
                required
                disabled={isEmployeeCategoryNotSelected}
              />
            </div>
          )}
          {visibleFields.divisi && (
            <div>
              <SelectField
                label="Divisi"
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={step3.divisi}
                onChange={(value) => handleChange('divisi', value)}
                onSearch={handleDivisionSearch}
                disabled={isEmployeeCategoryNotSelected || divisionOptions.length === 0}
                required
              />
            </div>
          )}

          {/* Baris 5 (Conditional) */}
          {visibleFields.departemen && (
            <div>
              <SelectField
                label="Departemen"
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={step3.departemen}
                onChange={(value) => handleChange('departemen', value)}
                disabled={isEmployeeCategoryNotSelected || departmentOptions.length === 0}
                onSearch={handleDepartmentSearch}
                required
              />
            </div>
          )}
          {visibleFields.unit && (
            <div>
              <SelectField
                label="Unit"
                options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
                defaultValue={step3.unit}
                onChange={(value) => handleChange('unit', value)}
                onSearch={handleUnitSearch}
                disabled={isEmployeeCategoryNotSelected || unitOptions.length === 0}
              />
            </div>
          )}

          {/* Baris 6 */}
          <div>
            <SelectField
              label="Jenjang Jabatan"
              options={positionLevelOptions}
              defaultValue={step3.jenjangJabatan}
              onChange={(value) => handleChange('jenjangJabatan', value)}
              onSearch={handlePositionLevelSearch}
              required
              disabled={isEmployeeCategoryNotSelected}
            />
          </div>
          {visibleFields.position && (
            <div>
              <SelectField
                label="Position"
                options={positionOptions}
                defaultValue={step3.position}
                onChange={(value) => handleChange('position', value)}
                onSearch={handlePositionSearch}
                required
                disabled={isEmployeeCategoryNotSelected}
              />
            </div>
          )}

          {/* Baris 7 */}
          <div>
            <SelectField
              label="Status PayRoll"
              options={STATUS_PAYROLL_OPTIONS}
              defaultValue={step3.statusPayroll}
              onChange={(value) => handleChange('statusPayroll', value)}
              required
              disabled={isEmployeeCategoryNotSelected}
            />
          </div>
          <div>
            <InputField
              label="Golongan"
              type="text"
              value={selectedGrade || step3.golongan}
              placeholder="Otomatis dari Jabatan"
              disabled
              onChange={() => {}}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step03EmployeeData;
