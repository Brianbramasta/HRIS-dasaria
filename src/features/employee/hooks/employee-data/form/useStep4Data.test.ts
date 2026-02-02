import { renderHook, waitFor, act } from '@testing-library/react';
import { useStep4Data } from './useStep4Data';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { useAuthStore } from '@/features/auth/stores/AuthStore';
import { useApiPayrollPreview } from '../../api/useApiPayrollPreview';
import * as useFormulirKaryawan from './useFormulirKaryawan';

// Mock dependencies
jest.mock('@/features/employee/stores/useFormulirKaryawanStore');
jest.mock('@/features/auth/stores/AuthStore');
jest.mock('../../api/useApiPayrollPreview');
jest.mock('./useFormulirKaryawan', () => ({
  getBankDropdownOptions: jest.fn(),
}));

describe('useStep4Data', () => {
  const mockUpdateStep3 = jest.fn();
  const mockStep3 = {
    nonFixAllowances: [{ id: '1', amount: 1000 }],
  };
  const mockStep1 = {
    statusMenikah: 'K0',
    jumlahTanggungan: '0',
  };
  const mockStep3Employee = {
    jenjangJabatan: 'L1',
    jabatan: 'J1',
    kategoriKaryawan: 'C1',
  };

  const mockFetchPreviewPayroll = jest.fn();
  const mockFetchNonFixAllowanceDropdown = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: {
        step3: mockStep3,
        step1: mockStep1,
        step3Employee: mockStep3Employee,
      },
      updateStep3: mockUpdateStep3,
    });

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    (useApiPayrollPreview as jest.Mock).mockReturnValue({
      fetchPreviewPayroll: mockFetchPreviewPayroll,
      fetchNonFixAllowanceDropdown: mockFetchNonFixAllowanceDropdown,
      previewData: { salaryAfterDeduction: 5000000 },
      nonFixAllowanceOptions: [],
    });

    (useFormulirKaryawan.getBankDropdownOptions as jest.Mock).mockResolvedValue([{ label: 'Bank A', value: '1' }]);
  });

  it('seharusnya memuat opsi bank saat inisialisasi', async () => {
    const { result } = renderHook(() => useStep4Data(true));

    await waitFor(() => {
      expect(result.current.bankOptions).toHaveLength(1);
    });
  });

  it('seharusnya memanggil fetchNonFixAllowanceDropdown jika terautentikasi', () => {
    renderHook(() => useStep4Data(true));
    expect(mockFetchNonFixAllowanceDropdown).toHaveBeenCalled();
  });

  it('seharusnya memanggil fetchPreviewPayroll jika data lengkap', () => {
    renderHook(() => useStep4Data(true));
    expect(mockFetchPreviewPayroll).toHaveBeenCalledWith(expect.objectContaining({
      Position_level_id: 'L1',
      job_title_id: 'J1',
    }));
  });

  it('seharusnya menghitung netSalary dengan benar', () => {
    const { result } = renderHook(() => useStep4Data(true));
    // 5.000.000 (base) + 1.000 (allowance)
    expect(result.current.netSalary).toBe(5001000);
  });

  it('seharusnya menambahkan allowance non-fix', () => {
    const { result } = renderHook(() => useStep4Data(true));
    act(() => {
      result.current.addNonFixAllowance();
    });
    
    expect(mockUpdateStep3).toHaveBeenCalledWith({
      nonFixAllowances: expect.arrayContaining([
        expect.objectContaining({ id: '1', amount: 1000 }),
        expect.objectContaining({ id: '', amount: 0 }),
      ]),
    });
  });

  it('seharusnya menghapus allowance non-fix', () => {
    const { result } = renderHook(() => useStep4Data(true));
    act(() => {
      result.current.removeNonFixAllowance(0);
    });

    expect(mockUpdateStep3).toHaveBeenCalledWith({
      nonFixAllowances: [],
    });
  });
  
  it('seharusnya mengupdate allowance non-fix', () => {
    const { result } = renderHook(() => useStep4Data(true));
    act(() => {
      result.current.updateNonFixAllowance(0, 'amount', 2000);
    });

    expect(mockUpdateStep3).toHaveBeenCalledWith({
      nonFixAllowances: [{ id: '1', amount: 2000 }],
    });
  });
});
