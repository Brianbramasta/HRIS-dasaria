import React from 'react';
import DateField from '../../../../components/shared/field/DateField';
import SelectField from '../../../../components/shared/field/SelectField';
import InputField from '../../../../components/shared/field/InputField';
import {  STATUS_PAYROLL_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep3Data } from '../../hooks/employee-data/form/useFromStep';

export const Step03EmployeeData: React.FC = () => {
  const { companyOptions, officeOptions, directorateOptions, divisionOptions, departmentOptions, jobTitleOptions, positionOptions, kategoriKaryawanOptions,positionLevelOptions,employeeStatusOptions, handleChange, selectedGrade, step3 } = useStep3Data();

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Data Karyawan
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <SelectField
                label="Kategori Karyawan"
                options={kategoriKaryawanOptions}
                defaultValue={step3.kategoriKaryawan}
                onChange={(value) => {
                  handleChange('kategoriKaryawan', value);
                  const selectedCategory = kategoriKaryawanOptions.find((opt: any) => opt.value === value);
                  console.log('kategoriKaryawan1',selectedCategory);
                  if (selectedCategory) {
                    const label = selectedCategory.label;
                    console.log('kategoriKaryawan2',label);
                    if (['Staff', 'Mitra'].includes(label)) {
                      const statusEvaluasi = employeeStatusOptions.find((opt: any) => opt.label === 'Evaluasi');
                      if (statusEvaluasi) handleChange('employmentStatus', statusEvaluasi.value);
                    } else if (label === 'Non-Staff') {
                      const statusAktif = employeeStatusOptions.find((opt: any) => opt.label === 'Aktif');
                      if (statusAktif) handleChange('employmentStatus', statusAktif.value);
                    }
                  }
                }}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <SelectField
                label="Status Karyawan"
                options={employeeStatusOptions.filter((status: any) => 
                  ['Aktif', 'Evaluasi'].includes(status.label)
                )}
                defaultValue={step3.employmentStatus}
                onChange={(value) => handleChange('employmentStatus', value)}
                placeholder="Select"
                required
                disabled
              />
            </div>
            <div>
              <DateField
                id="tanggalMasuk"
                label="Tanggal Masuk"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalMasuk as any}
                onChange={(...args) => handleChange('tanggalMasuk', args[1] as string)}
                required
              />
            </div>
            <div>
              <DateField
                id="tanggalAkhir"
                label="Tanggal Akhir"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalAkhir as any}
                onChange={(...args) => handleChange('tanggalAkhir', args[1] as string)}
                required
              />
            </div>
            <div>
              <SelectField
                label="Perusahaan"
                options={companyOptions}
                defaultValue={step3.company}
                onChange={(value) => handleChange('company', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <SelectField
                label="Kantor"
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
                defaultValue={step3.kantor}
                onChange={(value) => handleChange('kantor', value)}
                placeholder="Select"
                disabled={officeOptions.length === 0}
                required
              />
            </div>
            <div>
              <SelectField
                label="Direktorat"
                options={directorateOptions}
                defaultValue={step3.direktorat}
                onChange={(value) => handleChange('direktorat', value)}
                placeholder="Select"
                
                required
              />
            </div>
           
           
          </div>

          <div className="space-y-4">
             <div>
              <SelectField
                label="Divisi"
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={step3.divisi}
                onChange={(value) => handleChange('divisi', value)}
                disabled={divisionOptions.length === 0}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <SelectField
                label="Departemen"
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={step3.departemen}
                onChange={(value) => handleChange('departemen', value)}
                disabled={departmentOptions.length === 0}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <SelectField
                label="Position"
                options={positionOptions}
                defaultValue={step3.position}
                onChange={(value) => handleChange('position', value)}
                placeholder="Select"
                required  
              />
            </div>
            <div>
              <SelectField
                label="Jabatan"
                options={jobTitleOptions}
                defaultValue={step3.jabatan}
                onChange={(value) => handleChange('jabatan', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <SelectField
                label="Jenjang Jabatan"
                options={positionLevelOptions}
                defaultValue={step3.jenjangJabatan}
                onChange={(value) => handleChange('jenjangJabatan', value)}
                placeholder="Select"
                required
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
            {/* <div>
              <Label>Hak Akses Pengguna</Label>
              <Select
                options={HAK_AKSES_OPTIONS}
                defaultValue={(step3 as any).userAccess}
                onChange={(value) => handleChange('userAccess', value)}
                placeholder="Select"
              />
            </div> */}
            <div>
              <SelectField
                label="Status PayRoll"
                options={STATUS_PAYROLL_OPTIONS}
                defaultValue={step3.statusPayroll}
                onChange={(value) => handleChange('statusPayroll', value)}
                placeholder="Select"
                required
              />
            </div>
            
            
            {/* <div>
              <Label>Resignation Status</Label>
              <Select
                options={RESIGNATION_STATUS_OPTIONS}
                defaultValue={step3.resignationStatus}
                onChange={(value) => handleChange('resignationStatus', value)}
                placeholder="Select"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step03EmployeeData;
