import { renderHook, act, waitFor } from '@testing-library/react';
import { useEditOrganizationHistoryModal } from './useEditOrganizationHistoryModal';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import * as useFormulirKaryawan from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';

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
    getCompanyDropdown: jest.fn(),
    getOfficeDropdown: jest.fn(),
    getDirectorateDropdown: jest.fn(),
    getDivisionsByDirectorate: jest.fn(),
    getDepartmentsByDivision: jest.fn(),
    getJobTitleDropdown: jest.fn(),
    getPositionDropdown: jest.fn(),
  },
}));

jest.mock('@/features/employee/hooks/employee-data/form/useFormulirKaryawan', () => ({
  getEmployeeCategoryDropdownOptions: jest.fn(),
  getPositionLevelDropdownOptions: jest.fn(),
  getStructuralJobDropdownOptions: jest.fn(),
  getUnitDropdownByDepartmentIdOptions: jest.fn(),
}));

jest.mock('@/features/employee/hooks/organization-history/useOrganizationChange', () => ({
  useOrganizationChange: jest.fn(),
}));

describe('useEditOrganizationHistoryModal', () => {
  const mockFetchChangeTypeOptions = jest.fn();
  const mockFetchEmployeeOptions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useOrganizationChange as jest.Mock).mockReturnValue({
      changeTypeOptions: [],
      fetchChangeTypeOptions: mockFetchChangeTypeOptions,
      employeeOptions: [{ value: 'emp1', name: 'John Doe', label: 'John Doe' }],
      fetchEmployeeOptions: mockFetchEmployeeOptions,
    });
    
    (useFormulirKaryawan.getEmployeeCategoryDropdownOptions as jest.Mock).mockResolvedValue([]);
    (useFormulirKaryawan.getPositionLevelDropdownOptions as jest.Mock).mockResolvedValue([]);
    (useFormulirKaryawan.getStructuralJobDropdownOptions as jest.Mock).mockResolvedValue([]);
    (useFormulirKaryawan.getUnitDropdownByDepartmentIdOptions as jest.Mock).mockResolvedValue([]);
    
    // Ensure these return promises resolving to undefined/empty array to prevent Promise.all failure
    (employeeMasterDataService.getDirectorateDropdown as jest.Mock).mockResolvedValue([]);
    (employeeMasterDataService.getPositionDropdown as jest.Mock).mockResolvedValue([]);
    (employeeMasterDataService.getJobTitleDropdown as jest.Mock).mockResolvedValue([]);
    (employeeMasterDataService.getCompanyDropdown as jest.Mock).mockResolvedValue([]); // Default
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('menginisialisasi form dengan data awal (initialData)', () => {
    const initialData = {
      id: '1',
      idKaryawan: 'emp1',
      name: 'John Doe',
      change_type_id: 'ct1',
    };

    const { result } = renderHook(() => useEditOrganizationHistoryModal({ isOpen: true, initialData }));

    expect(result.current.form.id).toBe('1');
    expect(result.current.form.employee_id).toBe('emp1');
    expect(result.current.form.nama).toBe('John Doe');
  });

  it('mengambil jenis perubahan dan data karyawan saat modal terbuka', () => {
    renderHook(() => useEditOrganizationHistoryModal({ isOpen: true }));
    expect(mockFetchChangeTypeOptions).toHaveBeenCalled();
    expect(mockFetchEmployeeOptions).toHaveBeenCalled();
  });

  it('mengelola pencarian karyawan dengan debounce', async () => {
    const { result } = renderHook(() => useEditOrganizationHistoryModal({ isOpen: true }));

    act(() => {
      result.current.handleEmployeeSearch('John');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(mockFetchEmployeeOptions).toHaveBeenCalledWith('John');
    });
  });

  it('mengisi otomatis nama karyawan ketika NIP dipilih', () => {
    const { result } = renderHook(() => useEditOrganizationHistoryModal({ isOpen: true }));

    act(() => {
      result.current.handleInput('nip', 'emp1');
    });

    expect(result.current.form.employee_id).toBe('emp1');
    expect(result.current.form.nama).toBe('John Doe');
  });

  it('mengelola pencarian perusahaan dengan debounce', async () => {
    const { result } = renderHook(() => useEditOrganizationHistoryModal({ isOpen: true }));
    act(() => {
      result.current.handleCompanySearch('Comp');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(employeeMasterDataService.getCompanyDropdown).toHaveBeenCalledWith('Comp');
    });
  });

  it('mengosongkan field turunan ketika field induk berubah', () => {
    const { result } = renderHook(() => useEditOrganizationHistoryModal({ isOpen: true }));

    // Set initial state
    act(() => {
      result.current.handleInput('directorate_id', 'dir1');
    });

    // Change directorate, should reset division and department
    act(() => {
      result.current.handleInput('directorate_id', 'dir2');
    });

    expect(result.current.form.division_id).toBe('');
    expect(result.current.form.department_id).toBe('');
  });

  it('mengambil opsi unit ketika departemen dipilih', async () => {
     const initialData = { department_id: 'dept1' };
     const { result } = renderHook(() => useEditOrganizationHistoryModal({ 
         isOpen: true, 
         initialData 
     }));

     const mockUnits = [{ id: 'u1', name: 'Unit A' }];
     (useFormulirKaryawan.getUnitDropdownByDepartmentIdOptions as jest.Mock).mockResolvedValue(mockUnits);

     act(() => {
         jest.advanceTimersByTime(400);
     });

     await waitFor(() => {
      expect(result.current.unitOptions).toEqual(mockUnits);
    });
  });
});
