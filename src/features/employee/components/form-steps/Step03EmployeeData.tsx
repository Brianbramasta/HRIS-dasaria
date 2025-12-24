import React from 'react';
import DatePicker from '../../../../components/form/date-picker';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import InputField from '../../../../components/form/input/InputField';
import { JENJANG_JABATAN_OPTIONS, STATUS_PAYROLL_OPTIONS, EMPLOYMENT_STATUS_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep3Data } from '../../hooks/employee-data/form/useFromStep';

export const Step03EmployeeData: React.FC = () => {
  const { companyOptions, officeOptions, directorateOptions, divisionOptions, departmentOptions, jobTitleOptions, positionOptions, kategoriKaryawanOptions, handleChange, selectedGrade, step3 } = useStep3Data();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Karyawan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label>Status Karyawan</Label>
              <Select
                options={EMPLOYMENT_STATUS_OPTIONS}
                defaultValue={step3.employmentStatus}
                onChange={(value) => handleChange('employmentStatus', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
              <DatePicker
                id="tanggalMasuk"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalMasuk as any}
                onChange={(...args) => handleChange('tanggalMasuk', args[1] as string)}
              />
            </div>
            <div>
              <Label htmlFor="tanggalAkhir">Tanggal Akhir</Label>
              <DatePicker
                id="tanggalAkhir"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalAkhir as any}
                onChange={(...args) => handleChange('tanggalAkhir', args[1] as string)}
              />
            </div>
            <div>
              <Label>Perusahaan</Label>
              <Select
                options={companyOptions}
                defaultValue={step3.company}
                onChange={(value) => handleChange('company', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label>Kantor</Label>
              <Select
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
                defaultValue={step3.kantor}
                onChange={(value) => handleChange('kantor', value)}
                placeholder="Select"
                disabled={officeOptions.length === 0}
              />
            </div>
            <div>
              <Label>Direktorat</Label>
              <Select
                options={directorateOptions}
                defaultValue={step3.direktorat}
                onChange={(value) => handleChange('direktorat', value)}
                placeholder="Select"
                
                required
              />
            </div>
            <div>
              <Label>Divisi</Label>
              <Select
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={step3.divisi}
                onChange={(value) => handleChange('divisi', value)}
                disabled={divisionOptions.length === 0}
                placeholder="Select"
              />
            </div>
            
          </div>

          <div className="space-y-4">
            <div>
              <Label>Departemen</Label>
              <Select
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={step3.departemen}
                onChange={(value) => handleChange('departemen', value)}
                disabled={departmentOptions.length === 0}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Position</Label>
              <Select
                options={positionOptions}
                defaultValue={step3.position}
                onChange={(value) => handleChange('position', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Select
                options={jobTitleOptions}
                defaultValue={step3.jabatan}
                onChange={(value) => handleChange('jabatan', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label>Jenjang Jabatan</Label>
              <Select
                options={JENJANG_JABATAN_OPTIONS}
                defaultValue={step3.jenjangJabatan}
                onChange={(value) => handleChange('jenjangJabatan', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label>Golongan</Label>
              <InputField
                type="text"
                value={selectedGrade || step3.golongan}
                placeholder="Otomatis dari Jabatan"
                disabled
                onChange={() => {}}
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
              <Label>Status PayRoll</Label>
              <Select
                options={STATUS_PAYROLL_OPTIONS}
                defaultValue={step3.statusPayroll}
                onChange={(value) => handleChange('statusPayroll', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Kategori Karyawan</Label>
              <Select
                options={kategoriKaryawanOptions}
                defaultValue={step3.kategoriKaryawan}
                onChange={(value) => handleChange('kategoriKaryawan', value)}
                placeholder="Select"
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
