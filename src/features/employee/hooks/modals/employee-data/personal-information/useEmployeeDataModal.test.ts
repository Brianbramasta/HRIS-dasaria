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
      
      const { result } = renderHook(() => useEmployeeDataModal({ isOpen: true, initialData }));
      
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
});
