import { useState, useEffect } from 'react';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { PTKPDropdownItem } from '../../../types/Employee';
import { getReligionDropdownOptions, getEducationDropdownOptions, getBankDropdownOptions, getDocumentTypeDropdownOptions, getEmployeeCategoryDropdownOptions } from './useFormulirKaryawan';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { DocumentItem, EducationItem } from '../../../types/FormEmployee';

// NOTE: The hooks below centralize business logic used across form steps 1-5.
// Each exported hook includes a comment indicating which form step(s) use it.

export const usePTKPDropdown = () => {
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
    fetchPTKPOptions();
  }, []);

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
export const useStep3Data = () => {
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  
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
    const fetchInitialData = async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions();
        setKategoriKaryawanOptions(kategori);

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
  }, []);

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
    setSelectedGrade,
    handleChange
  };
};

// digunakan di form 4
export const useStep4Data = () => {
  const [bankOptions, setBankOptions] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    getBankDropdownOptions().then((opts:any) => { if (mounted) setBankOptions(opts); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return { bankOptions };
};

// digunakan di form 5
export const useStep5Data = () => {
  const { formData, updateStep4 } = useFormulirKaryawanStore();
  const [documentTypeOptions, setDocumentTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    getDocumentTypeDropdownOptions().then((opts:any) => { if (mounted) setDocumentTypeOptions(opts); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const step4 = formData.step4;

  const [rows, setRows] = useState<{ id: number; tipeFile: string; files: File[] }[]>([
    { id: 1, tipeFile: '', files: [] },
  ]);
  const [resetKey, setResetKey] = useState(0);

  const addRow = () => {
    setRows((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [...prev, { id: nextId, tipeFile: '', files: [] }];
    });
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTypeChange = (id: number, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, tipeFile: value } : r)));
  };

  const handleFilesChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, files } : r)));
  };

  const handleUpload = () => {
    const documents = step4.documents || [];
    const newDocs: DocumentItem[] = [];
    rows.forEach((r) => {
      if (!r.tipeFile || r.files.length === 0) return;
      r.files.forEach((file) => {
        newDocs.push({
          tipeFile: r.tipeFile,
          namaFile: file.name,
          file,
          filePath: URL.createObjectURL(file),
        });
      });
    });
    if (newDocs.length) {
      updateStep4({ documents: [...documents, ...newDocs] });
      setRows([{ id: 1, tipeFile: '', files: [] }]);
      setResetKey((k) => k + 1);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const documents = step4.documents || [];
    const newDocuments = documents.filter((_, i) => i !== index);
    updateStep4({ documents: newDocuments });
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypeOptions.find((opt) => opt.value === type)?.label || type;
  };

  return { documentTypeOptions, rows, resetKey,step4, updateStep4, addRow, removeRow, handleTypeChange, handleFilesChange, handleUpload, handleRemoveDocument, getDocumentTypeLabel  };
};