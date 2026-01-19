import { renderHook, act, waitFor } from '@testing-library/react';
import { useEmployeeDataModal } from './useEmployeeDataModal';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/features/employee/services/EmployeeMasterData.service', () => ({
  employeeMasterDataService: {
    getEmployeeStatusDropdown: jest.fn(),
    getCompanyDropdown: jest.fn(),
    getOfficeDropdown: jest.fn(),
    getDirectorateDropdown: jest.fn(),
    getDivisionsByDirectorate: jest.fn(),
    getDepartmentsByDivision: jest.fn(),
    getUnitDropdownByDepartmentId: jest.fn(),
    getJobTitleDropdown: jest.fn(),
    getPositionDropdown: jest.fn(),
    getPositionLevelDropdown: jest.fn(),
    getEmployeeCategoryDropdown: jest.fn(),
  },
}));

jest.mock('@/features/employee/hooks/employee-data/form/useFormulirKaryawan', () => ({
  getStructuralJobDropdownOptions: jest.fn(),
}));

describe('useEmployeeDataModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('menginisialisasi form dengan data awal (initialData)', () => {
    const initialData = {
      employment_status: 'Aktif',
      company_id: 'c1',
    };

    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true, initialData }));

    expect(result.current.form).toEqual(initialData);
  });

  it('mengambil dropdown independen awal saat modal dibuka', async () => {
    const mockStatus = [{ id: 's1', name: 'Permanent' }];
    (employeeMasterDataService.getEmployeeStatusDropdown as jest.Mock).mockResolvedValue(mockStatus);

    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));

    await waitFor(() => {
      expect(result.current.employeeStatusOptions).toEqual([
        { value: 's1', label: 'Permanent' },
      ]);
    });
  });

  it('mengelola pencarian perusahaan dengan debounce', async () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));
    const mockCompanies = [{ id: 'c1', company_name: 'Company A' }];
    (employeeMasterDataService.getCompanyDropdown as jest.Mock).mockResolvedValue(mockCompanies);

    act(() => {
      result.current.handleCompanySearch('Comp');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(result.current.companyOptions).toEqual([
        { value: 'c1', label: 'Company A' },
      ]);
    });
  });

  it('mengosongkan field turunan ketika field induk berubah', () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));

    // Set initial state
    act(() => {
      result.current.handleInput('company_id', 'c1');
    });

    // Change company, should reset office
    act(() => {
      result.current.handleInput('company_id', 'c2');
    });

    expect(result.current.form.office_id).toBe('');
  });

  it('mengambil data kantor ketika perusahaan dipilih', async () => {
    const initialData = { company_id: 'c1' };
    const { result } = renderHook(() => useEmployeeDataModal({ 
      isOpen: true, 
      initialData 
    }));

    const mockOffices = [{ id: 'o1', office_name: 'Office A' }];
    (employeeMasterDataService.getOfficeDropdown as jest.Mock).mockResolvedValue(mockOffices);

    // Trigger effect by ensuring search state or just initial load with company_id
    // The effect depends on [officeSearch, isOpen, form.company_id]
    // Initial load should trigger it because company_id is present
    
    act(() => {
        jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(result.current.officeOptions).toEqual([
        { value: 'o1', label: 'Office A' },
      ]);
    });
  });

  it('mengisi otomatis golongan ketika jabatan dipilih', async () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));

    const mockJobTitles = [{ id: 'j1', job_title_name: 'Job 1', grade: 'Grade A' }];
    (employeeMasterDataService.getJobTitleDropdown as jest.Mock).mockResolvedValue(mockJobTitles);

    // Wait for options to load
    act(() => {
        jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
        expect(result.current.jobTitleOptions).toHaveLength(1);
    });

    // Select job title
    act(() => {
      result.current.handleInput('job_title_id', 'j1');
    });

    expect(result.current.selectedGrade).toBe('Grade A');
    expect(result.current.form.golongan).toBe('Grade A');
  });

  it('mengambil dropdown berjenjang (Direktorat -> Divisi -> Departemen -> Unit)', async () => {
      const initialData = {
          directorate_id: 'dir1',
          division_id: 'div1',
          department_id: 'dept1'
      };
      
      renderHook(() => useEmployeeDataModal({ isOpen: true, initialData }));
      
      (employeeMasterDataService.getDivisionsByDirectorate as jest.Mock).mockResolvedValue([{ id: 'div1', division_name: 'Division 1' }]);
      (employeeMasterDataService.getDepartmentsByDivision as jest.Mock).mockResolvedValue([{ id: 'dept1', department_name: 'Dept 1' }]);
      (employeeMasterDataService.getUnitDropdownByDepartmentId as jest.Mock).mockResolvedValue([{ id: 'u1', name: 'Unit 1' }]);

      act(() => {
          jest.advanceTimersByTime(400);
      });
      
      await waitFor(() => {
          expect(employeeMasterDataService.getDivisionsByDirectorate).toHaveBeenCalledWith('dir1', undefined);
          expect(employeeMasterDataService.getDepartmentsByDivision).toHaveBeenCalledWith('div1', undefined);
          expect(employeeMasterDataService.getUnitDropdownByDepartmentId).toHaveBeenCalledWith('dept1', undefined);
      });
  });

  it('mereset field turunan (Directorate -> Division -> Dept -> Unit) saat parent berubah', () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));

    // Setup initial state
    act(() => {
      result.current.handleInput('directorate_id', 'dir1');
      result.current.handleInput('division_id', 'div1');
      result.current.handleInput('department_id', 'dept1');
      result.current.handleInput('unit_id', 'u1');
    });

    // Change Directorate
    act(() => {
      result.current.handleInput('directorate_id', 'dir2');
    });

    expect(result.current.form.division_id).toBe('');
    expect(result.current.form.department_id).toBe('');
    expect(result.current.form.unit_id).toBe('');
  });

  it('mengambil opsi structural job dan mengatur golongan saat job title dipilih', async () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));
    const mockStructuralJobs = [{ id: 'struct1', name: 'Struct Job 1' }];
    const mockJobTitles = [{ id: 'j1', job_title_name: 'Manager', grade: 'GR-1' }];
    
    (employeeMasterDataService.getJobTitleDropdown as jest.Mock).mockResolvedValue(mockJobTitles);
    const { getStructuralJobDropdownOptions } = require('@/features/employee/hooks/employee-data/form/useFormulirKaryawan');
    getStructuralJobDropdownOptions.mockResolvedValue(mockStructuralJobs);

    // Trigger load job titles
    act(() => {
      jest.advanceTimersByTime(400);
    });
    
    await waitFor(() => {
       expect(result.current.jobTitleOptions).toHaveLength(1);
    });

    // Select Job Title
    await act(async () => {
      result.current.handleInput('job_title_id', 'j1');
    });

    // Verify Grade is set
    expect(result.current.selectedGrade).toBe('GR-1');
    expect(result.current.form.golongan).toBe('GR-1');

    // Verify Structural Jobs Fetch
    await waitFor(() => {
      expect(getStructuralJobDropdownOptions).toHaveBeenCalledWith('j1');
      expect(result.current.structuralJobOptions).toEqual(mockStructuralJobs);
    });

    // Change Job Title (reset logic)
    act(() => {
      result.current.handleInput('job_title_id', 'j2'); // j2 doesn't exist in options
    });

    expect(result.current.form.structural_job_id).toBe('');
    expect(result.current.form.golongan).toBe('');
    expect(result.current.selectedGrade).toBe('');
  });

  it('menghitung properti isDisabledField dengan benar', () => {
    // Case 1: Initial Data Kosong
    const emptyData = {};
    const { result: resEmpty } = renderHook(() => useEmployeeDataModal({ isOpen: true, initialData: emptyData }));
    expect(resEmpty.current.isDisabledField).toBe(true);

    // Case 2: Status Aktif
    const activeData = { employment_status: 'Aktif', company_id: 'c1' };
    const { result: resActive } = renderHook(() => useEmployeeDataModal({ 
      isOpen: true, 
      initialData: activeData 
    }));
    expect(resActive.current.isDisabledField).toBe(true);

    // Case 3: Data Tidak Lengkap
    const incompleteData = { employment_status: 'Probation', company_id: 'c1' };
    const { result: resIncomplete } = renderHook(() => useEmployeeDataModal({ 
      isOpen: true, 
      initialData: incompleteData
    }));
    expect(resIncomplete.current.isDisabledField).toBe(false);

    // Case 4: Data Lengkap
    const completeData = {
      employment_status: 'Probation',
      employment_status_id: 'es1',
      start_date: '2023-01-01',
      company_id: 'c1',
      office_id: 'o1',
      directorate_id: 'd1',
      division_id: 'div1',
      department_id: 'dept1',
      unit_id: 'u1',
      position_id: 'p1',
      job_title_id: 'j1',
      position_level_id: 'pl1',
      employee_category_id: 'ec1',
      structural_job_id: 'sj1'
    };
    const { result: resComplete } = renderHook(() => useEmployeeDataModal({ 
      isOpen: true, 
      initialData: completeData
    }));
    expect(resComplete.current.isDisabledField).toBe(true);
  });

  it('menangani error saat fetch dropdown gagal', async () => {
    const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true }));
    
    (employeeMasterDataService.getCompanyDropdown as jest.Mock).mockRejectedValue(new Error('API Error'));

    act(() => {
      result.current.handleCompanySearch('ErrorComp');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(result.current.companyOptions).toEqual([]);
    });
  });
});
