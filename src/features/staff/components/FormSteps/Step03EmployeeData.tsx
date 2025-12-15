import React, { useEffect, useState } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import DatePicker from '../../../../components/form/date-picker';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import InputField from '../../../../components/form/input/InputField';
import employeeMasterDataService from '../../services/employeeMasterData.service';

// const STATUS_KARYAWAN_OPTIONS = [
//   { label: 'Aktif', value: 'aktif' },
//   { label: 'Nonaktif', value: 'nonaktif' },
// ];

const JENJANG_JABATAN_OPTIONS = [
  { label: 'General', value: '1' },
  { label: 'Junior', value: '2' },
  { label: 'Middle', value: '3' },
  { label: 'Senior', value: '4' },
];

const HAK_AKSES_OPTIONS = [
  { label: 'HR/Admin', value: 'hr/admin' },
  { label: 'Staff', value: 'staff' },
];

const STATUS_PAYROLL_OPTIONS = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '2' },
  { label: 'Suspended', value: '3' },
];

const KATEGORI_KARYAWAN_OPTIONS = [
  { label: 'Non-Staff', value: '1' },
  { label: 'Staff', value: '2' },
  { label: 'Mitra', value: '3' },
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// const RESIGNATION_STATUS_OPTIONS = [
//   { label: 'Belum Resign', value: 'not_resigned' },
//   { label: 'Sudah Resign', value: 'resigned' },
// ];

export const Step03EmployeeData: React.FC = () => {
  const { formData, updateStep3Employee } = useFormulirKaryawanStore();
  const step3 = formData.step3Employee;

  const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([]);
  const [officeOptions, setOfficeOptions] = useState<{ label: string; value: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ label: string; value: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ label: string; value: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{ label: string; value: string }[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<{ label: string; value: string; grade?: string }[]>([]);
  const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  const handleChange = (field: string, value: string) => {
    updateStep3Employee({ [field]: value } as any);
    
    // Reset dependent fields when parent selection changes
    if (field === 'direktorat') {
      updateStep3Employee({ divisi: '', departemen: '' } as any);
      setDivisionOptions([]);
      setDepartmentOptions([]);
    } else if (field === 'divisi') {
      updateStep3Employee({ departemen: '' } as any);
      setDepartmentOptions([]);
    } else if (field === 'jabatan') {
      // Find the selected job title's grade
      const selectedJob = jobTitleOptions.find(job => job.value === value);
      console.log('Selected Job Title Grade:', selectedJob?.grade)
      console.log('jobTitleOptions:', jobTitleOptions)
      console.log('value:', value)
      if (selectedJob?.grade) {
        setSelectedGrade(selectedJob.grade);
        updateStep3Employee({ golongan: selectedJob.grade } as any);
      }
    }
  };

  // Initial fetch: Company, Office, Directorate, Position, Job Title
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch companies
        const companies = await employeeMasterDataService.getCompanyDropdown();
        setCompanyOptions((companies || []).map((i: any) => ({ 
          label: i.company_name, 
          value: i.id
        })));

        // Fetch offices
        const offices = await employeeMasterDataService.getOfficeDropdown();
        setOfficeOptions((offices || []).map((i: any) => ({ 
          label: i.office_name, 
          value: i.id
        })));

        // Fetch directorates
        const directorates = await employeeMasterDataService.getDirectorateDropdown();
        setDirectorateOptions((directorates || []).map((i: any) => ({ 
          label: i.directorate_name, 
          value: i.id 
        })));

        // Fetch positions
        const positions = await employeeMasterDataService.getPositionDropdown();
        setPositionOptions((positions || []).map((i: any) => ({ 
          label: i.position_name, 
          value: i.id
        })));

        // Fetch job titles with grade
        const jobTitles = await employeeMasterDataService.getJobTitleDropdown();
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ 
          label: i.job_title_name, 
          value: i.id,
          grade: i.grade
        })));

        // If jabatan is already selected, set the grade
        if (step3.jabatan) {
          const selectedJob = jobTitles.find((i: any) => i.id_job_title === step3.jabatan);
          if (selectedJob?.grade) {
            setSelectedGrade(selectedJob.grade);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch divisions when directorate changes
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!step3.direktorat) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(step3.direktorat);
        setDivisionOptions((items || []).map((i: any) => ({ 
          label: i.division_name, 
          value: i.id 
        })));
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [step3.direktorat]);

  // Fetch departments when division changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!step3.divisi) {
        setDepartmentOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(step3.divisi);
        setDepartmentOptions((items || []).map((i: any) => ({ 
          label: i.department_name, 
          value: i.id 
        })));
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartmentOptions([]);
      }
    };
    fetchDepartments();
  }, [step3.divisi]);

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
                options={officeOptions}
                defaultValue={step3.kantor}
                onChange={(value) => handleChange('kantor', value)}
                placeholder="Select"
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
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Departemen</Label>
              <Select
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={step3.departemen}
                onChange={(value) => handleChange('departemen', value)}
                placeholder="Select"
              />
            </div>
          </div>

          <div className="space-y-4">
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
            <div>
              <Label>Hak Akses Pengguna</Label>
              <Select
                options={HAK_AKSES_OPTIONS}
                defaultValue={(step3 as any).userAccess}
                onChange={(value) => handleChange('userAccess', value)}
                placeholder="Select"
              />
            </div>
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
                options={KATEGORI_KARYAWAN_OPTIONS}
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
