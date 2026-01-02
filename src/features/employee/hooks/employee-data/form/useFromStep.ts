import { useState, useEffect } from 'react';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { PTKPDropdownItem } from '../../../types/Employee';
import { getReligionDropdownOptions, getEducationDropdownOptions, getBankDropdownOptions, getEmployeeCategoryDropdownOptions, getPositionLevelDropdownOptions, getEmployeeStatusDropdownOptions, getFieldDocument } from './useFormulirKaryawan';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { DocumentItem, EducationItem } from '../../../types/FormEmployee';

// NOTE: The hooks below centralize business logic used across form steps 1-5.
// Each exported hook includes a comment indicating which form step(s) use it.

export const usePTKPDropdown = (isOpen?: boolean) => {
  const [ptkpOptions, setPtkpOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPTKPOptions = async (search?: string) => {
    setLoading(true);
    try {
      const data = await employeeMasterDataService.getPTKPDropdown(search);
      const options = data.map((item: PTKPDropdownItem) => ({
        value: item.id,
        label: `${item.code} - ${item.category}`,
      }));
      setPtkpOptions(options);
    } catch (error) {
      console.error('Error fetching PTKP options:', error);
      setPtkpOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPTKPOptions();
    }
  }, [isOpen]);

  return {
    ptkpOptions,
    loading,
    fetchPTKPOptions,
  };
};

// digunakan di form 1
export const useStep1Data = () => {
  const [agamaOptions, setAgamaOptions] = useState<any[]>([]);
  const [pendidikanOptions, setPendidikanOptions] = useState<any[]>([]);
  const { formData, updateStep1 } = useFormulirKaryawanStore();
  const step1 = formData.step1;

  const handleChange = (field: string, value: string) => {
    updateStep1({ [field]: value } as any);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateStep1({ fotoProfil: file } as any);
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([getReligionDropdownOptions(), getEducationDropdownOptions()])
      .then(([religions, educations]) => {
        if (!mounted) return;
        setAgamaOptions(religions);
        setPendidikanOptions(educations);
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  return { agamaOptions, pendidikanOptions, step1, handleChange, handleFileChange };
};

// digunakan di form 2
export const useStep2Data = () => {
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState<any[]>([]);
  const { formData, updateStep2 } = useFormulirKaryawanStore();
  const step2 = formData.step2;
  const addEducationRow = () => {
    const education = step2.education || [];
    updateStep2({
      education: [
        ...education,
        {
          jenisPendidikan: 'formal',
          jenjang: '',
          namaLembaga: '',
          gelar: '',
          nilaiPendidikan: '',
          jurusanKeahlian: '',
          tahunLulus: '',
          namaSertifikat: '',
          organisasiPenerbit: '',
          tanggalPenerbitan: '',
          tanggalKedaluwarsa: '',
          idKredensial: '',
        },
      ],
    });
  };

  const removeEducationRow = (index: number) => {
    const education = step2.education || [];
    updateStep2({ education: education.filter((_: EducationItem, i: number) => i !== index) });
  };

  const updateEducationField = (
    index: number,
    field: keyof EducationItem,
    value: string | File | undefined,
  ) => {
    const education = step2.education || [];
    const next = education.map((item: EducationItem, i: number) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateStep2({ education: next });
  };
  

  const handleChange = (field: string, value: string) => {
    updateStep2({ [field]: value } as any);
  };

   useEffect(() => {
    if (!step2.education || step2.education.length === 0) {
      updateStep2({
        education: [
          {
            jenisPendidikan: 'formal',
            jenjang: '',
            namaLembaga: '',
            gelar: '',
            nilaiPendidikan: '',
            jurusanKeahlian: '',
            tahunLulus: '',
            // Non-formal defaults
            namaSertifikat: '',
            organisasiPenerbit: '',
            tanggalPenerbitan: '',
            tanggalKedaluwarsa: '',
            idKredensial: '',
          },
        ],
      });
    }
  }, [step2.education, updateStep2]);

  useEffect(() => {
    let mounted = true;
    getEducationDropdownOptions()
      .then((opts:any) => { if (mounted) setPendidikanTerakhir(opts); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return { step2, pendidikanTerakhir, addEducationRow, removeEducationRow, updateEducationField, handleChange };
};

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
  
  const { formData,updateStep3Employee } = useFormulirKaryawanStore();
  const step3 = formData.step3Employee;

  const handleChange = (field: string, value: string) => {
    // handle dependent resets atomically so hook effects can update options
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
    if (field === 'jabatan') {
      updateStep3Employee({ jabatan: value } as any);
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
        const filteredEmployeeStatuses = employeeStatuses.filter((status: any) => 
          ['Aktif', 'Evaluasi'].includes(status.label)
        );
        setEmployeeStatusOptions(filteredEmployeeStatuses);

        const companies = await employeeMasterDataService.getCompanyDropdown();
        setCompanyOptions((companies || []).map((i: any) => ({ label: i.company_name, value: i.id })));

        const directorates = await employeeMasterDataService.getDirectorateDropdown();
        setDirectorateOptions((directorates || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));

        const positions = await employeeMasterDataService.getPositionDropdown();
        setPositionOptions((positions || []).map((i: any) => ({ label: i.position_name, value: i.id })));

        const jobTitles = await employeeMasterDataService.getJobTitleDropdown();
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch (error) {
        console.error('Error fetching initial data (step3):', error);
      }
    };
    fetchInitialData();
  }, [isOpen]);

  // divisions when directorate changes
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!step3?.direktorat) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(step3.direktorat);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [step3?.direktorat]);

  // departments when division changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!step3?.divisi) { setDepartmentOptions([]); return; }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(step3.divisi);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch (error) { console.error('Error fetching departments:', error); setDepartmentOptions([]); }
    };
    fetchDepartments();
  }, [step3?.divisi]);

  // offices when company changes
  useEffect(() => {
    const fetchOffices = async () => {
      if (!step3?.company) { setOfficeOptions([]); return; }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown('', step3.company);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch (error) { console.error('Error fetching offices:', error); setOfficeOptions([]); }
    };
    fetchOffices();
  }, [step3?.company]);

  return {
    step3,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    selectedGrade,
    positionLevelOptions,
    employeeStatusOptions,
    setSelectedGrade,
    handleChange
  };
};

// digunakan di form 4
export const useStep4Data = (isOpen?: boolean) => {
  const [bankOptions, setBankOptions] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen === false) return;
    
    let mounted = true;
    getBankDropdownOptions().then((opts:any) => { if (mounted) setBankOptions(opts); }).catch(() => {});
    return () => { mounted = false; };
  }, [isOpen]);

  return { bankOptions };
};

// digunakan di form 5
export const useStep5Data = () => {
  const { formData, updateStep4 } = useFormulirKaryawanStore();
  const step3 = formData.step3Employee;
  const step4 = formData.step4;
  const categoryId = step3.kategoriKaryawan;

  const [documentFields, setDocumentFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      // console.warn('useStep5Data: No categoryId found (step3Employee.kategoriKaryawan is empty). Cannot fetch documents.');
      // return;
    }
    
    let mounted = true;
    setLoading(true);
    console.log(`useStep5Data: Fetching documents for categoryId: ${categoryId}`);
    
    getFieldDocument(categoryId)
      .then((data) => {
        if (mounted) {
           console.log('useStep5Data: Documents fetched:', data);
           setDocumentFields(data || []);
        }
      })
      .catch((err) => console.error('useStep5Data: Error fetching document fields:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, [categoryId]);

  const handleFileChange = (fieldId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const documents = step4.documents || [];
    
    const existingIndex = documents.findIndex((doc: DocumentItem) => doc.tipeFile === fieldId);
    
    let newDocuments = [...documents];
    
    if (file) {
      const newDoc: DocumentItem = {
        tipeFile: fieldId,
        namaFile: file.name,
        file: file,
        filePath: URL.createObjectURL(file),
      };
      
      if (existingIndex >= 0) {
        newDocuments[existingIndex] = newDoc;
      } else {
        newDocuments.push(newDoc);
      }
    } else {
      if (existingIndex >= 0) {
        newDocuments = newDocuments.filter((_, idx) => idx !== existingIndex);
      }
    }
    
    updateStep4({ documents: newDocuments });
  };

  // Filter documents based on category
  // Accommodate potential variations in API response strings
  const personalDocuments = documentFields.filter(d => 
    ['Pribadi', 'Berkas / Dokumen Karyawan', 'Personal', 'Karyawan'].includes(d.document_category)
  );
  const legalDocuments = documentFields.filter(d => 
    ['Legal', 'Berkas / Dokumen Legal', 'Perusahaan'].includes(d.document_category)
  );

  const getFileForField = (fieldId: string) => {
    return step4.documents?.find((doc: DocumentItem) => doc.tipeFile === fieldId);
  };

  return {
    personalDocuments,
    legalDocuments,
    loading,
    handleFileChange,
    getFileForField
  };
};