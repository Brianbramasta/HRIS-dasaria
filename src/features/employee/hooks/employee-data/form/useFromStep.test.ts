import { renderHook, act, waitFor } from '@testing-library/react';
import { useStep3Data, usePTKPDropdown } from './useFromStep';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import * as useFormulirKaryawan from './useFormulirKaryawan';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../services/EmployeeMasterData.service', () => ({
  employeeMasterDataService: {
    getPTKPDropdown: jest.fn(),
    getCompanyDropdown: jest.fn(),
    getDirectorateDropdown: jest.fn(),
    getDivisionsByDirectorate: jest.fn(),
    getDepartmentsByDivision: jest.fn(),
    getJobTitleDropdown: jest.fn(),
    getPositionDropdown: jest.fn(),
    getOfficeDropdown: jest.fn(),
  },
}));

jest.mock('@/features/employee/stores/useFormulirKaryawanStore');

// Mock the entire module to prevent imports
jest.mock('./useFormulirKaryawan', () => ({
  getReligionDropdownOptions: jest.fn(),
  getEducationDropdownOptions: jest.fn(),
  getEmployeeCategoryDropdownOptions: jest.fn(),
  getPositionLevelDropdownOptions: jest.fn(),
  getEmployeeStatusDropdownOptions: jest.fn(),
  getStructuralJobDropdownOptions: jest.fn(),
  getUnitDropdownByDepartmentIdOptions: jest.fn(),
  getBankDropdownOptions: jest.fn(),
  getFieldDocument: jest.fn(),
}));

// Mock the services/api to prevent import.meta.env issues
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));


describe('useFromStep Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('usePTKPDropdown', () => {
    it('mengambil opsi PTKP saat dropdown dibuka', async () => {
      const mockData = [{ id: '1', code: 'K0', category: 'Kawin 0 Anak' }];
      (employeeMasterDataService.getPTKPDropdown as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => usePTKPDropdown(true));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.ptkpOptions).toEqual([
        { value: '1', label: 'K0 - Kawin 0 Anak' },
      ]);
    });

    it('tidak mengambil data ketika dropdown tidak dibuka', () => {
      renderHook(() => usePTKPDropdown(false));
      expect(employeeMasterDataService.getPTKPDropdown).not.toHaveBeenCalled();
    });
  });

  describe('useStep3Data (Server-side Search)', () => {
    const mockUpdateStep3Employee = jest.fn();
    const mockStep3Data = {
      company: '',
      direktorat: '',
      divisi: '',
      departemen: '',
      jabatan: '',
      golongan: '',
    };

    beforeEach(() => {
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step3Employee: mockStep3Data },
        updateStep3Employee: mockUpdateStep3Employee,
      });

      (useFormulirKaryawan.getEmployeeCategoryDropdownOptions as jest.Mock).mockResolvedValue([]);
      (useFormulirKaryawan.getPositionLevelDropdownOptions as jest.Mock).mockResolvedValue([]);
      (useFormulirKaryawan.getEmployeeStatusDropdownOptions as jest.Mock).mockResolvedValue([]);
      (useFormulirKaryawan.getStructuralJobDropdownOptions as jest.Mock).mockResolvedValue([]);
      (useFormulirKaryawan.getUnitDropdownByDepartmentIdOptions as jest.Mock).mockResolvedValue([]);
    });

    it('mengelola pencarian perusahaan dengan debounce', async () => {
      const mockCompanies = [{ id: 'c1', company_name: 'Company A' }];
      (employeeMasterDataService.getCompanyDropdown as jest.Mock).mockResolvedValue(mockCompanies);

      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handleCompanySearch('Company');
      });

      // Fast-forward debounce time
      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.companyOptions).toEqual([
          { value: 'c1', label: 'Company A' },
        ]);
      });
    });

    it('mengosongkan dropdown turunan saat direktorat berubah (Directorate -> Division)', () => {
      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handleChange('direktorat', 'new-dir');
      });

      expect(mockUpdateStep3Employee).toHaveBeenCalledWith({
        direktorat: 'new-dir',
        divisi: '',
        departemen: '',
      });
    });

    it('mengambil data divisi ketika direktorat dipilih', async () => {
      // Setup dynamic store behavior
      let currentStep3Data = { ...mockStep3Data, direktorat: 'dir1' };
      (useFormulirKaryawanStore as unknown as jest.Mock).mockImplementation(() => ({
        formData: { step3Employee: currentStep3Data },
        updateStep3Employee: mockUpdateStep3Employee,
      }));

      const mockDivisions = [{ id: 'div1', division_name: 'Division A' }];
      (employeeMasterDataService.getDivisionsByDirectorate as jest.Mock).mockResolvedValue(mockDivisions);

      const { result, rerender } = renderHook(() => useStep3Data(true));

      await waitFor(() => {
        expect(result.current.divisionOptions).toEqual([
          { value: 'div1', label: 'Division A' },
        ]);
      });
    });

    it('mengisi otomatis golongan ketika jabatan dipilih', async () => {
      // Setup store
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step3Employee: mockStep3Data },
        updateStep3Employee: mockUpdateStep3Employee,
      });

      // Mock service response
      (employeeMasterDataService.getJobTitleDropdown as jest.Mock).mockResolvedValue([
        { id: 'j1', job_title_name: 'Job 1', grade: 'Grade A' }
      ]);

      const { result } = renderHook(() => useStep3Data(true));

      // Trigger initial fetch
      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Wait for options to be populated
      await waitFor(() => {
        expect(result.current.jobTitleOptions.length).toBeGreaterThan(0);
      });

      // Now update the selection
      act(() => {
        result.current.handleChange('jabatan', 'j1');
      });

      expect(mockUpdateStep3Employee).toHaveBeenCalledWith({
        jabatan: 'j1'
      });
      
      // Check if grade update was called
      expect(mockUpdateStep3Employee).toHaveBeenCalledWith({
        golongan: 'Grade A'
      });
    });
  });
});
