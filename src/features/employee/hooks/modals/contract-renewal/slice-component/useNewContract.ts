import { useState, useEffect, useCallback, useMemo } from "react";
import { employeeMasterDataService } from "@/features/employee/services/EmployeeMasterData.service";
import { useApiContractExtension } from "@/features/employee/hooks/api/useApiContractExtension";
import {
  getEmployeeCategoryDropdownOptions,
  getPositionLevelDropdownOptions,
  getStructuralJobDropdownOptions,
  getUnitDropdownByDepartmentIdOptions,
} from "@/features/employee/hooks/employee-data/form/useFormulirKaryawan";
import { payrollPreviewService } from "@/features/employee/services/PayrollPreviewService";
import { useApiEmployeePositions } from "@/features/structure-and-organize/hooks/api/useApiEmployeePositions";

type Params = {
  data?: {
    new_change_type_id?: string;
    new_change_type_name?: string;
    new_employee_category_name?: string;
    new_company_name?: string;
    new_office_name?: string;
    new_directorate_name?: string;
    new_division_name?: string;
    new_department_name?: string;
    new_unit_name?: string;
    new_position_name?: string;
    new_job_title_name?: string;
    new_structural_position_name?: string;
    new_position_level_name?: string;
    new_grade?: string;
    new_basic_salary?: string | number;
    new_contract_document?: string;
    // Salary components
    new_gaji_pokok?: string | number;
    new_tunjangan_pernikahan?: string | number;
    new_tunjangan_jabatan?: string | number;
    new_tunjangan_lama_kerja?: string | number;
    new_tunjangan_diskresi?: Array<{ id: string; amount: number }>;
    new_gaji_bersih?: string | number;
    marital_status?: string;
    dependents?: number;
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
};

export function useNewContract({
  data = {},
  isEditing = false,
  onChange,
}: Params) {
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>(
    [],
  );
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  const [jabatanStrukturalOptions, setJabatanStrukturalOptions] = useState<
    any[]
  >([]);
  const [unitOptions, setUnitOptions] = useState<any[]>([]);
  const [diskresiOptions] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [officeSearch, setOfficeSearch] = useState("");
  const [directorateSearch, setDirectorateSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [jobTitleSearch, setJobTitleSearch] = useState("");
  const [positionSearch, setPositionSearch] = useState("");
  const [positionLevelSearch, setPositionLevelSearch] = useState("");
  const [employeeCategorySearch, setEmployeeCategorySearch] = useState("");

  const { changeTypeOptions, fetchChangeTypes } = useApiContractExtension();

  // Initialize employee positions hook
  const {
    employeePositions,
    fetchEmployeePositions
  } = useApiEmployeePositions();

  // Category checking logic
  const selectedCategoryLabel = useMemo(() => {
    if (!data?.new_employee_category_name) return "";
    return kategoriKaryawanOptions.find(opt => String(opt.value) === String(data.new_employee_category_name))?.label || "";
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  const selectedJobLabel = useMemo(() => {
    if (!data?.new_job_title_name) return "";
    return jobTitleOptions.find(opt => String(opt.value) === String(data.new_job_title_name))?.label || "";
  }, [data?.new_job_title_name, jobTitleOptions]);

  const selectedStructuralJobLabel = useMemo(() => {
    if (!data?.new_structural_position_name) return "";
    return jabatanStrukturalOptions.find(opt => String(opt.value) === String(data.new_structural_position_name))?.label || "";
  }, [data?.new_structural_position_name, jabatanStrukturalOptions]);

  // Filter job title options based on selected category
  const filteredJobTitleOptions = useMemo(() => {
    if (!selectedCategoryLabel) return jobTitleOptions;

    const lowerCategory = selectedCategoryLabel.toLowerCase();

    if (lowerCategory.includes("non-staff") || lowerCategory.includes("non staff")) {
      return jobTitleOptions.filter(opt => opt.label.includes('PKL') || opt.label.includes('Internship'));
    }
    if (lowerCategory.includes("mitra")) {
      return jobTitleOptions.filter(opt => opt.label.includes('Kemitraan'));
    }
    if (lowerCategory.includes("staff")) {
      const staffLabels = [
        'Entry Level',
        'Officer',
        'Principal',
        'Supervisor',
        'Manager',
        'Direktur'
      ];
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

    const lowerCategory = selectedCategoryLabel.toLowerCase();

    if (lowerCategory.includes("non-staff") || lowerCategory.includes("non staff") || lowerCategory.includes("mitra")) {
      // tampilkan pilihan lengkap Departmen sampai position
      return fields;
    }

    if (lowerCategory.includes("staff")) {
      if (['Entry Level', 'Officer'].some(l => selectedJobLabel.includes(l))) {
        return fields;
      }
      
      // Reset defaults for higher level staff
      fields.divisi = false;
      fields.departemen = false;
      fields.unit = false;
      fields.position = false;

      if (selectedJobLabel.includes('Principal')) {
        fields.direktorat = true;
        fields.divisi = true;
        fields.departemen = true;
        if (['Branch Leader', 'Kepala Branch'].includes(selectedStructuralJobLabel)) {
          fields.unit = true;
        }
      } else if (selectedJobLabel.includes('Supervisor')) {
        fields.direktorat = true;
        fields.divisi = true;
        fields.departemen = true;
      } else if (selectedJobLabel.includes('Manager')) {
        fields.direktorat = true;
        fields.divisi = true;
      } else if (['Direktur', 'Director'].includes(selectedJobLabel)) {
        fields.direktorat = true;
      } else {
        // Fallback for staff with no specific job title selected yet
        fields.direktorat = true;
        fields.divisi = true;
        fields.departemen = true;
        fields.unit = true;
        fields.position = true;
      }
    }

    return fields;
  }, [selectedCategoryLabel, selectedJobLabel, selectedStructuralJobLabel]);

  // Fetch filtered employee positions based on selected criteria
  useEffect(() => {
    const fetchFilteredPositions = async () => {
      try {
        const filterParams: any = {
          get_all: 1
        };
        
        if (positionSearch) {
          filterParams.search = positionSearch;
        }
        
        await fetchEmployeePositions(filterParams);
      } catch (error) {
        console.error('Error fetching filtered positions:', error);
      }
    };
    
    fetchFilteredPositions();
  }, [positionSearch, fetchEmployeePositions]);

  // Filter positions on client side based on selected criteria
  const filteredPositionOptions = useMemo(() => {
    if (!employeePositions.length) return [];
    
    return employeePositions
      .filter((position) => {
        // Filter by job_title_id if selected
        if (data?.new_job_title_name && position.positionId !== data.new_job_title_name) {
          return false;
        }
        
        // Filter by structural_job_id if selected
        if (data?.new_structural_position_name && position.structuralJobId !== data.new_structural_position_name) {
          return false;
        }
        
        // Filter by directorate_id if selected
        if (data?.new_directorate_name && position.directorateId !== data.new_directorate_name) {
          return false;
        }
        
        // Filter by division_id if selected
        if (data?.new_division_name && position.divisionId !== data.new_division_name) {
          return false;
        }
        
        // Filter by department_id if selected
        if (data?.new_department_name && position.departmentId !== data.new_department_name) {
          return false;
        }
        
        // Filter by unit_id if selected (optional)
        if (data?.new_unit_name && position.unitId !== data.new_unit_name) {
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
    data?.new_job_title_name,
    data?.new_structural_position_name,
    data?.new_directorate_name,
    data?.new_division_name,
    data?.new_department_name,
    data?.new_unit_name
  ]);

  // Update position options when filtered options change
  useEffect(() => {
    setPositionOptions(filteredPositionOptions);
  }, [filteredPositionOptions]);

  const isNonStaffOrMitraCategory = useMemo(() => {
    if (!data?.new_employee_category_name) return false; // ❌ langsung return false kalau masih kosong
    const categoryOption = kategoriKaryawanOptions.find(
      (option) =>
        String(option.value) === String(data.new_employee_category_name),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    const result =
      categoryName?.includes("mitra") ||
      categoryName?.includes("non staff") ||
      categoryName === "non-staff";
    console.log("🔍 isNonStaffOrMitraCategory changed:", {
      categoryId: data.new_employee_category_name,
      categoryName,
      result,
    });
    return result;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  const isStaffCategory = useMemo(() => {
    if (!data?.new_employee_category_name) return false;
    const categoryOption = kategoriKaryawanOptions.find(
      (option) =>
        String(option.value) === String(data.new_employee_category_name),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    return categoryName?.includes("staff") || categoryName === "staff";
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(
      (option) => option.value === data?.new_employee_category_name,
    );
    const categoryName = categoryOption?.label;
    let label = "Gaji Pokok";
    if (
      categoryName?.toLowerCase() === "non-staff" ||
      categoryName?.toLowerCase().includes("non staff")
    )
      label = "Uang Saku";
    if (
      categoryName?.toLowerCase() === "mitra" ||
      categoryName?.toLowerCase().includes("mitra")
    )
      label = "Fee";
    return label;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      if (onChange) {
        // handle dependent resets atomically
        if (field === "new_employee_category_name") {
          onChange("new_job_title_name", "");
          onChange("new_structural_position_name", "");
        } else if (field === "new_company_name") {
          onChange("new_office_name", "");
        } else if (field === "new_directorate_name") {
          onChange("new_division_name", "");
          onChange("new_department_name", "");
        } else if (field === "new_division_name") {
          onChange("new_department_name", "");
        } else if (field === "new_department_name") {
          onChange("new_unit_name", "");
        } else if (field === "new_structural_position_name") {
          onChange("new_unit_name", "");
        } else if (field === "new_job_title_name") {
          onChange("new_structural_position_name", "");
          onChange("new_unit_name", "");
          onChange("new_department_name", "");
          onChange("new_division_name", ""); // Corrected field name
          onChange("new_position_name", "");
        }

        onChange(field, value);
      }
    },
    [onChange],
  );
  const [newContractData, setNewContractData] = useState(data || {});

  // Sync local data with props data
  useEffect(() => {
    setNewContractData(data || {});
  }, [data]);

  // helper
  const handleNewContractChange = useCallback(
    (field: string, value: any) => {
      setNewContractData((prev) => ({ ...prev, [field]: value }));
      handleInputChange(field, value); // update props callback
    },
    [handleInputChange],
  );
  const addNonFixAllowance = useCallback(() => {
    const currentDiskresi = data?.new_tunjangan_diskresi || [];
    const newDiskresi = [...currentDiskresi, { id: "", amount: 0 }];
    handleInputChange("new_tunjangan_diskresi", newDiskresi);
  }, [data?.new_tunjangan_diskresi, handleInputChange]);

  const removeNonFixAllowance = useCallback(
    (index: number) => {
      const currentDiskresi = data?.new_tunjangan_diskresi || [];
      const newDiskresi = currentDiskresi.filter((_, i) => i !== index);
      handleInputChange("new_tunjangan_diskresi", newDiskresi);
    },
    [data?.new_tunjangan_diskresi, handleInputChange],
  );

  const updateNonFixAllowance = useCallback(
    (index: number, field: "id" | "amount", value: any) => {
      const currentDiskresi = data?.new_tunjangan_diskresi || [{ id: "", amount: 0 }];
      const newDiskresi = currentDiskresi.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      handleInputChange("new_tunjangan_diskresi", newDiskresi);
    },
    [data?.new_tunjangan_diskresi, handleInputChange],
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        fetchChangeTypes();
        const kategori = await getEmployeeCategoryDropdownOptions();
        setKategoriKaryawanOptions(kategori);
        const positionLevels = await getPositionLevelDropdownOptions();
        setPositionLevelOptions(positionLevels);
      } catch {
        setKategoriKaryawanOptions([]);
        setPositionLevelOptions([]);
      }
    };
    fetchInitialData();
  }, [fetchChangeTypes]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const companies = await employeeMasterDataService.getCompanyDropdown(
          companySearch || undefined,
        );
        setCompanyOptions(
          (companies || []).map((i: any) => ({
            label: i.company_name,
            value: i.id,
          })),
        );
      } catch {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [companySearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const directorates =
          await employeeMasterDataService.getDirectorateDropdown(
            directorateSearch || undefined,
          );
        setDirectorateOptions(
          (directorates || []).map((i: any) => ({
            label: i.directorate_name,
            value: i.id,
          })),
        );
      } catch {
        setDirectorateOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [directorateSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const positions = await employeeMasterDataService.getPositionDropdown(
          positionSearch || undefined,
        );
        setPositionOptions(
          (positions || []).map((i: any) => ({
            label: i.position_name,
            value: i.id,
          })),
        );
      } catch {
        setPositionOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const jobTitles = await employeeMasterDataService.getJobTitleDropdown(
          jobTitleSearch || undefined,
        );
        setJobTitleOptions(
          (jobTitles || []).map((i: any) => ({
            label: i.job_title_name,
            value: i.id,
            grade: i.grade,
          })),
        );
      } catch {
        setJobTitleOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [jobTitleSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions(
          employeeCategorySearch || undefined,
        );
        setKategoriKaryawanOptions(kategori);
      } catch {
        setKategoriKaryawanOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [employeeCategorySearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const positionLevels = await getPositionLevelDropdownOptions(
          positionLevelSearch || undefined,
        );
        setPositionLevelOptions(positionLevels);
      } catch {
        setPositionLevelOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionLevelSearch]);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!data?.new_directorate_name) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(
          data.new_directorate_name,
          divisionSearch || undefined,
        );
        setDivisionOptions(
          (items || []).map((i: any) => ({
            label: i.division_name,
            value: i.id,
          })),
        );
      } catch {
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [data?.new_directorate_name, divisionSearch]);

  useEffect(() => {
    const fetchStructuralJobs = async () => {
      if (!data?.new_job_title_name) {
        setJabatanStrukturalOptions([]);
        return;
      }
      try {
        const items = await getStructuralJobDropdownOptions(
          data.new_job_title_name,
        );
        setJabatanStrukturalOptions(items);
      } catch {
        setJabatanStrukturalOptions([]);
      }
    };
    fetchStructuralJobs();
  }, [data?.new_job_title_name]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!data?.new_division_name) {
        setDepartmentOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(
          data.new_division_name,
          departmentSearch || undefined,
        );
        setDepartmentOptions(
          (items || []).map((i: any) => ({
            label: i.department_name,
            value: i.id,
          })),
        );
      } catch {
        setDepartmentOptions([]);
      }
    };
    fetchDepartments();
  }, [data?.new_division_name, departmentSearch]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!data?.new_department_name) {
        setUnitOptions([]);
        return;
      }
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(
          data.new_department_name,
          unitSearch || undefined,
        );
        setUnitOptions(items);
      } catch {
        setUnitOptions([]);
      }
    };
    fetchUnits();
  }, [data?.new_department_name, unitSearch]);

  useEffect(() => {
    const fetchOffices = async () => {
      if (!data?.new_company_name) {
        setOfficeOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(
          officeSearch || undefined,
          data.new_company_name,
        );
        setOfficeOptions(
          (items || []).map((i: any) => ({
            label: i.office_name,
            value: i.id,
          })),
        );
      } catch {
        setOfficeOptions([]);
      }
    };
    fetchOffices();
  }, [data?.new_company_name, officeSearch]);

  useEffect(() => {
    const selectedJob = jobTitleOptions.find(
      (job) => job.value === data?.new_job_title_name,
    );
    if (selectedJob?.grade) {
      setSelectedGrade(selectedJob.grade);
      handleInputChange("new_grade", selectedJob.grade);
    }
  }, [jobTitleOptions, data?.new_job_title_name, handleInputChange]);

  const [selectedEmployeeCategory, setSelectedEmployeeCategory] =
    useState<string>("");

  useEffect(() => {
    if (
      data?.new_employee_category_name &&
      kategoriKaryawanOptions.length > 0
    ) {
      const exists = kategoriKaryawanOptions.find(
        (opt) => String(opt.value) === String(data.new_employee_category_name),
      );
      if (exists) {
        setSelectedEmployeeCategory(exists.value);
      }
    }
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  useEffect(() => {
    const fetchPayrollPreview = async () => {
      if (
        !newContractData?.new_job_title_name ||
        !newContractData?.new_position_level_name ||
        !newContractData?.marital_status // pastikan marital_status ada
      )
        return;

      try {
        const params = {
          job_title_id: newContractData.new_job_title_name,
          Position_level_id: newContractData.new_position_level_name,
          employee_categories_id:
            newContractData.new_employee_category_name || "",
          category: newContractData.marital_status, // key tetap "category"
          dependents: Number(newContractData.dependents) || 0,
        };

        const res = await payrollPreviewService.getPreviewPayroll(params);
        const pp = res.data;

        // Use local updates for immediate preview, then let parent sync back
        setNewContractData(prev => ({
          ...prev,
          new_gaji_pokok: pp.basic_salary,
          new_tunjangan_jabatan: pp.position_allowance,
        }));
        
        handleInputChange("new_gaji_pokok", pp.basic_salary);
        handleInputChange("new_tunjangan_jabatan", pp.position_allowance);
        
        // Calculate total tunjangan diskresi
        const totalTunjanganDiskresi = (newContractData.new_tunjangan_diskresi || [])
          .filter(item => item.id && item.amount > 0)
          .reduce((total, item) => total + (item.amount || 0), 0);

        const gajiBersih =
          (pp.basic_salary || 0) +
          (newContractData.new_tunjangan_lama_kerja || 0) +
          (newContractData.new_tunjangan_pernikahan || 0) +
          (pp.position_allowance || 0) +
          totalTunjanganDiskresi;
        
        setNewContractData(prev => ({ ...prev, new_gaji_bersih: gajiBersih }));
        handleInputChange("new_gaji_bersih", gajiBersih);
      } catch (err) {
        console.error("Failed to fetch payroll preview", err);
      }
    };

    fetchPayrollPreview();
  }, [
    newContractData?.new_job_title_name,
    newContractData?.new_position_level_name,
    newContractData?.new_employee_category_name,
    newContractData?.marital_status, // pastikan sudah ada
    newContractData?.dependents,
    handleInputChange, // Change dependency to handleInputChange
  ]);

  // Calculate Gaji Bersih when tunjangan diskresi or other salary components change
  useEffect(() => {
    if (!newContractData?.new_gaji_pokok) return; // wait for basic salary to be calculated

    // Calculate total tunjangan diskresi
    const totalTunjanganDiskresi = (newContractData.new_tunjangan_diskresi || [])
      .filter(item => item.id && item.amount > 0)
      .reduce((total, item) => total + (item.amount || 0), 0);

    const gajiBersih =
      Number(newContractData.new_gaji_pokok || 0) +
      Number(newContractData.new_tunjangan_lama_kerja || 0) +
      Number(newContractData.new_tunjangan_pernikahan || 0) +
      Number(newContractData.new_tunjangan_jabatan || 0) +
      totalTunjanganDiskresi;
    
    setNewContractData(prev => ({ ...prev, new_gaji_bersih: gajiBersih }));
    handleInputChange("new_gaji_bersih", gajiBersih);
  }, [
    newContractData?.new_gaji_pokok,
    newContractData?.new_tunjangan_lama_kerja,
    newContractData?.new_tunjangan_pernikahan,
    newContractData?.new_tunjangan_jabatan,
    newContractData?.new_tunjangan_diskresi,
    handleInputChange, // Change dependency to handleInputChange
  ]);

  return {
    isEditing,
    data,
    changeTypeOptions,
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
    jabatanStrukturalOptions,
    unitOptions,
    diskresiOptions,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    visibleFields,
    salaryLabel,
    setCompanySearch,
    setOfficeSearch,
    setDirectorateSearch,
    setDivisionSearch,
    setDepartmentSearch,
    setUnitSearch,
    setJobTitleSearch,
    setPositionSearch,
    setPositionLevelSearch,
    setEmployeeCategorySearch,
    handleInputChange,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
    selectedEmployeeCategory,
    setSelectedEmployeeCategory,
    handleNewContractChange,
  };
}
