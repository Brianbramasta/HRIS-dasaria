import { useState, useEffect, useMemo } from 'react';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { getEmployeeCategoryDropdownOptions, getPositionLevelDropdownOptions, getEmployeeStatusDropdownOptions, getStructuralJobDropdownOptions, getUnitDropdownByDepartmentIdOptions } from './useFormulirKaryawan';
import { useApiEmployeePositions } from '../../../../structure-and-organize/hooks/api/useApiEmployeePositions';

// digunakan di form 3
export const useStep3Data = (isOpen?: boolean) => {
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  const [employeeStatusOptions, setEmployeeStatusOptions] = useState<any[]>([]);
  const [jabatanStrukturalOptions, setJabatanStrukturalOptions] = useState<any[]>([]);
  const [unitOptions, setUnitOptions] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [officeSearch, setOfficeSearch] = useState('');
  const [directorateSearch, setDirectorateSearch] = useState('');
  const [divisionSearch, setDivisionSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [positionLevelSearch, setPositionLevelSearch] = useState('');
  const [employeeCategorySearch, setEmployeeCategorySearch] = useState('');
  
  const { formData,updateStep3Employee } = useFormulirKaryawanStore();
  const step3 = formData.step3Employee;
  
  // Initialize employee positions hook
  const {
    employeePositions,
    fetchEmployeePositions
  } = useApiEmployeePositions();

  // Derive selected labels
  const selectedCategoryLabel = kategoriKaryawanOptions.find(opt => opt.value === step3.kategoriKaryawan)?.label || '';
  const selectedJobLabel = jobTitleOptions.find(opt => opt.value === step3.jabatan)?.label || '';
  const selectedStructuralJobLabel = jabatanStrukturalOptions.find(opt => opt.value === step3.jabatanStruktural)?.label || '';

  // Filter job title options based on selected category
  const filteredJobTitleOptions = useMemo(() => {
    if (!selectedCategoryLabel) return jobTitleOptions;

    if (selectedCategoryLabel === 'Non-Staff') {
      return jobTitleOptions.filter(opt => opt.label.includes('Non-Staff'));
    }
    if (selectedCategoryLabel === 'Mitra') {
      return jobTitleOptions.filter(opt => ['Kemitraan', 'Partnership'].some(keyword => opt.label.includes(keyword)));
    }
    if (selectedCategoryLabel === 'Staff') {
      const staffLabels = [
        'Entry Level',
        'Officer',
        'Principal',
        'Supervisor',
        'Manager',
        'Direktur'
      ];
      // Use includes for flexibility in labels
      return jobTitleOptions.filter(opt => staffLabels.some(label => opt.label.includes(label)));
    }
    return jobTitleOptions;
  }, [jobTitleOptions, selectedCategoryLabel]);

  // Determine field visibility based on job title and structural job
  const visibleFields = useMemo(() => {
    // Default visibility
    const fields = {
      direktorat: true,
      divisi: true,
      departemen: true,
      unit: true,
      position: true,
    };

    if (!selectedCategoryLabel) return fields;

    if (selectedCategoryLabel === 'Non-Staff' || selectedCategoryLabel === 'Mitra') {
      // tampilkan pilihan lengkap Departmen sampai position
      return fields;
    }

    if (selectedCategoryLabel === 'Staff') {
      if (['Entry Level', 'Officer'].some(l => selectedJobLabel.includes(l))) {
        return fields;
      }
      
      // Reset defaults for higher level staff
      fields.divisi = false;
      fields.departemen = false;
      fields.unit = false;
      fields.position = true;

      if (selectedJobLabel.includes('Principal')) {
        fields.divisi = true;
        fields.departemen = true;
        if (['Branch Leader', 'Kepala Branch'].includes(selectedStructuralJobLabel)) {
          fields.unit = true;
        }
      } else if (selectedJobLabel.includes('Supervisor')) {
        fields.divisi = true;
        fields.departemen = true;
      } else if (selectedJobLabel.includes('Manager')) {
        fields.divisi = true;
      } else if (['Direktur', 'Director'].includes(selectedJobLabel)) {
        // Only direktorat
      } else {
        // Fallback for staff with no specific job title selected yet
        fields.divisi = true;
        fields.departemen = true;
        fields.unit = true;
        fields.position = true;
      }
    }

    return fields;
  }, [selectedCategoryLabel, selectedJobLabel, selectedStructuralJobLabel]);

  const handleChange = (field: string, value: string) => {
    // handle dependent resets atomically so hook effects can update options
    if (field === 'kategoriKaryawan') {
      updateStep3Employee({ kategoriKaryawan: value, jabatan: '', jabatanStruktural: '' } as any);
      return;
    }
    if (field === 'company') {
      updateStep3Employee({ company: value, kantor: '' } as any);
      return;
    }
    if (field === 'direktorat') {
      updateStep3Employee({ direktorat: value, divisi: '', departemen: '' } as any);
      return;
    }
    if (field === 'divisi') {
      updateStep3Employee({ divisi: value, departemen: '' } as any);
      return;
    }
    if (field === 'departemen') {
      updateStep3Employee({ departemen: value, unit: '' } as any);
      return;
    }
    if (field === 'jabatanStruktural') {
      updateStep3Employee({ jabatanStruktural: value, unit: '' } as any);
      return;
    }
    if (field === 'jabatan') {
      updateStep3Employee({ 
        jabatan: value, 
        jabatanStruktural: '', 
        unit: '', 
        departemen: '', 
        divisi: '', 
        position: '' 
      } as any);
      const selectedJob = jobTitleOptions.find(job => job.value === value);
      if (selectedJob?.grade) {
        setSelectedGrade(selectedJob.grade);
        updateStep3Employee({ golongan: selectedJob.grade } as any);
      } else {
        setSelectedGrade('');
        updateStep3Employee({ golongan: '' } as any);
      }
      return;
    }

    updateStep3Employee({ [field]: value } as any);
  };

  useEffect(() => {
    const selectedJob = jobTitleOptions.find(job => job.value === step3.jabatan);
    if (selectedJob?.grade) setSelectedGrade(selectedJob.grade);
  }, [jobTitleOptions, step3.jabatan]);

  useEffect(() => {
    // Hanya fetch ketika modal dibuka atau ketika isOpen tidak didefinisikan (untuk form)
    if (isOpen === false) return;

    const fetchInitialData = async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions();
        setKategoriKaryawanOptions(kategori);

        const positionLevels = await getPositionLevelDropdownOptions();
        setPositionLevelOptions(positionLevels);

        const employeeStatuses = await getEmployeeStatusDropdownOptions();
        const filteredEmployeeStatuses = employeeStatuses;
        setEmployeeStatusOptions(filteredEmployeeStatuses);
      } catch (error) {
        console.error('Error fetching initial data (step3):', error);
      }
    };
    fetchInitialData();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const handler = setTimeout(async () => {
      try {
        const companies = await employeeMasterDataService.getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((companies || []).map((i: any) => ({ label: i.company_name, value: i.id })));
      } catch {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [companySearch, isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const handler = setTimeout(async () => {
      try {
        const directorates = await employeeMasterDataService.getDirectorateDropdown(directorateSearch || undefined);
        setDirectorateOptions((directorates || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
      } catch {
        setDirectorateOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [directorateSearch, isOpen]);

  // Fetch filtered employee positions based on selected criteria
  useEffect(() => {
    if (isOpen === false) return;
    
    const fetchFilteredPositions = async () => {
      try {
        // Fetch all positions with get_all:1 parameter
        const filterParams: any = {
          get_all: 1
        };
        
        // Add search if user is searching
        if (positionSearch) {
          filterParams.search = positionSearch;
        }
        
        await fetchEmployeePositions(filterParams);
      } catch (error) {
        console.error('Error fetching filtered positions:', error);
      }
    };
    
    fetchFilteredPositions();
  }, [positionSearch, isOpen, fetchEmployeePositions]);

  // Filter positions on client side based on selected criteria
  const filteredPositionOptions = useMemo(() => {
    if (!employeePositions.length) return [];
    
    return employeePositions
      .filter((position) => {
        // Filter by job_title_id if selected
        if (step3.jabatan && position.positionId !== step3.jabatan) {
          return false;
        }
        
        // Filter by structural_job_id if selected
        if (step3.jabatanStruktural && position.structuralJobId !== step3.jabatanStruktural) {
          return false;
        }
        
        // Filter by directorate_id if selected
        if (step3.direktorat && position.directorateId !== step3.direktorat) {
          return false;
        }
        
        // Filter by division_id if selected
        if (step3.divisi && position.divisionId !== step3.divisi) {
          return false;
        }
        
        // Filter by department_id if selected
        if (step3.departemen && position.departmentId !== step3.departemen) {
          return false;
        }
        
        // Filter by unit_id if selected (optional)
        if (step3.unit && position.unitId !== step3.unit) {
          return false;
        }
        
        return true;
      })
      .map((position) => ({
        label: position.name,
        value: position.id
      }));
  }, [
    employeePositions,
    step3.jabatan,
    step3.jabatanStruktural,
    step3.direktorat,
    step3.divisi,
    step3.departemen,
    step3.unit
  ]);

  // Update position options when filtered options change
  useEffect(() => {
    setPositionOptions(filteredPositionOptions);
  }, [filteredPositionOptions]);

  useEffect(() => {
    if (isOpen === false) return;
    const handler = setTimeout(async () => {
      try {
        const jobTitles = await employeeMasterDataService.getJobTitleDropdown(jobTitleSearch || undefined);
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch {
        setJobTitleOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [jobTitleSearch, isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const handler = setTimeout(async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions(employeeCategorySearch || undefined);
        setKategoriKaryawanOptions(kategori);
      } catch {
        setKategoriKaryawanOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [employeeCategorySearch, isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const handler = setTimeout(async () => {
      try {
        const positionLevels = await getPositionLevelDropdownOptions(positionLevelSearch || undefined);
        setPositionLevelOptions(positionLevels);
      } catch {
        setPositionLevelOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionLevelSearch, isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const fetchDivisions = async () => {
      if (!step3?.direktorat) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(step3.direktorat, divisionSearch || undefined);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [step3?.direktorat, divisionSearch, isOpen]);

  useEffect(() => {
    if (isOpen === false) return;
    const fetchStructuralJobs = async () => {
      if (!step3?.jabatan) { setJabatanStrukturalOptions([]); return; }
      try {
        const items = await getStructuralJobDropdownOptions(step3.jabatan);
        setJabatanStrukturalOptions(items);
      } catch (error) { console.error('Error fetching structural jobs:', error); setJabatanStrukturalOptions([]); }
    };
    fetchStructuralJobs();
  }, [step3?.jabatan, isOpen]);

  // departments when division changes
  useEffect(() => {
    if (isOpen === false) return;
    const fetchDepartments = async () => {
      if (!step3?.divisi) { setDepartmentOptions([]); return; }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(step3.divisi, departmentSearch || undefined);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch (error) { console.error('Error fetching departments:', error); setDepartmentOptions([]); }
    };
    fetchDepartments();
  }, [step3?.divisi, departmentSearch, isOpen]);

  // units when department changes
  useEffect(() => {
    if (isOpen === false) return;
    const fetchUnits = async () => {
      if (!step3?.departemen) { setUnitOptions([]); return; }
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(step3.departemen, unitSearch || undefined);
        setUnitOptions(items);
      } catch (error) { console.error('Error fetching units:', error); setUnitOptions([]); }
    };
    fetchUnits();
  }, [step3?.departemen, unitSearch, isOpen]);

  // offices when company changes
  useEffect(() => {
    if (isOpen === false) return;
    const fetchOffices = async () => {
      if (!step3?.company) { setOfficeOptions([]); return; }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(officeSearch || undefined, step3.company);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch (error) { console.error('Error fetching offices:', error); setOfficeOptions([]); }
    };
    fetchOffices();
  }, [step3?.company, officeSearch, isOpen]);

  const handleCompanySearch = (value: string) => setCompanySearch(value);
  const handleOfficeSearch = (value: string) => setOfficeSearch(value);
  const handleDirectorateSearch = (value: string) => setDirectorateSearch(value);
  const handleDivisionSearch = (value: string) => setDivisionSearch(value);
  const handleDepartmentSearch = (value: string) => setDepartmentSearch(value);
  const handleUnitSearch = (value: string) => setUnitSearch(value);
  const handleJobTitleSearch = (value: string) => setJobTitleSearch(value);
  const handlePositionSearch = (value: string) => setPositionSearch(value);
  const handlePositionLevelSearch = (value: string) => setPositionLevelSearch(value);
  const handleEmployeeCategorySearch = (value: string) => setEmployeeCategorySearch(value);

  return {
    step3,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions: filteredJobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    selectedGrade,
    positionLevelOptions,
    employeeStatusOptions,
    setSelectedGrade,
    handleChange,
    jabatanStrukturalOptions,
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
  };
};
