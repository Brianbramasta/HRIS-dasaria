import { renderHook, act, waitFor } from '@testing-library/react';
import { useStep1Data, useStep2Data, useStep3Data, useStep4Data, useStep5Data, usePTKPDropdown } from './useFromStep';
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

if (!('URL' in global)) {
  (global as any).URL = {} as any;
}
(global as any).URL.createObjectURL = jest.fn(() => 'mock-url');

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

  describe('useStep1Data', () => {
    const mockUpdateStep1 = jest.fn();
    const mockStep1 = { nama: 'Initial' };

    beforeEach(() => {
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step1: mockStep1 },
        updateStep1: mockUpdateStep1,
      });

      (useFormulirKaryawan.getReligionDropdownOptions as jest.Mock).mockResolvedValue([
        { value: '1', label: 'Islam' },
      ]);
      (useFormulirKaryawan.getEducationDropdownOptions as jest.Mock).mockResolvedValue([
        { value: 's1', label: 'S1' },
      ]);
    });

    it('mengambil opsi agama dan pendidikan saat mount', async () => {
      const { result } = renderHook(() => useStep1Data());

      await waitFor(() => {
        expect(result.current.agamaOptions).toEqual([{ value: '1', label: 'Islam' }]);
        expect(result.current.pendidikanOptions).toEqual([{ value: 's1', label: 'S1' }]);
      });

      expect(result.current.step1).toBe(mockStep1);
    });

    it('memperbarui field step1 melalui handleChange', () => {
      const { result } = renderHook(() => useStep1Data());

      act(() => {
        result.current.handleChange('namaLengkap', 'Budi');
      });

      expect(mockUpdateStep1).toHaveBeenCalledWith({ namaLengkap: 'Budi' });
    });

    it('memperbarui fotoProfil melalui handleFileChange', () => {
      const file = new File(['content'], 'foto.png', { type: 'image/png' });
      const { result } = renderHook(() => useStep1Data());

      act(() => {
        result.current.handleFileChange({
          target: { files: [file] },
        } as any);
      });

      expect(mockUpdateStep1).toHaveBeenCalledWith({ fotoProfil: file });
    });
  });

  describe('useStep2Data', () => {
    const mockUpdateStep2 = jest.fn();
    const baseEducation = [
      {
        jenisPendidikan: 'formal',
        jenjang: 'S1',
        namaLembaga: 'A',
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
    ];
    const mockStep2 = { education: baseEducation };

    beforeEach(() => {
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step2: mockStep2 },
        updateStep2: mockUpdateStep2,
      });

      (useFormulirKaryawan.getEducationDropdownOptions as jest.Mock).mockResolvedValue([
        { value: 's1', label: 'S1' },
      ]);
    });

    it('mengambil opsi pendidikan terakhir saat mount', async () => {
      const { result } = renderHook(() => useStep2Data());

      await waitFor(() => {
        expect(result.current.pendidikanTerakhir).toEqual([{ value: 's1', label: 'S1' }]);
      });

      expect(result.current.step2).toBe(mockStep2);
    });

    it('menambah baris education dengan nilai default', () => {
      const { result } = renderHook(() => useStep2Data());

      act(() => {
        result.current.addEducationRow();
      });

      const lastCall = (mockUpdateStep2 as jest.Mock).mock.calls.pop()[0];
      expect(lastCall.education).toHaveLength(baseEducation.length + 1);
      expect(lastCall.education[lastCall.education.length - 1]).toEqual({
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
      });
    });

    it('menghapus baris education sesuai index', () => {
      const step2WithTwo = {
        education: [...baseEducation, { ...baseEducation[0], namaLembaga: 'B' }],
      };

      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step2: step2WithTwo },
        updateStep2: mockUpdateStep2,
      });

      const { result } = renderHook(() => useStep2Data());

      act(() => {
        result.current.removeEducationRow(0);
      });

      const lastCall = (mockUpdateStep2 as jest.Mock).mock.calls.pop()[0];
      expect(lastCall.education).toHaveLength(1);
      expect(lastCall.education[0].namaLembaga).toBe('B');
    });

    it('memperbarui field education tertentu', () => {
      const { result } = renderHook(() => useStep2Data());

      act(() => {
        result.current.updateEducationField(0, 'namaLembaga' as any, 'Baru');
      });

      const lastCall = (mockUpdateStep2 as jest.Mock).mock.calls.pop()[0];
      expect(lastCall.education[0].namaLembaga).toBe('Baru');
    });

    it('memperbarui field step2 melalui handleChange', () => {
      const { result } = renderHook(() => useStep2Data());

      act(() => {
        result.current.handleChange('statusPendidikan', 'Aktif');
      });

      expect(mockUpdateStep2).toHaveBeenCalledWith({ statusPendidikan: 'Aktif' });
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
      const currentStep3Data = { ...mockStep3Data, direktorat: 'dir1' };
      (useFormulirKaryawanStore as unknown as jest.Mock).mockImplementation(() => ({
        formData: { step3Employee: currentStep3Data },
        updateStep3Employee: mockUpdateStep3Employee,
      }));

      const mockDivisions = [{ id: 'div1', division_name: 'Division A' }];
      (employeeMasterDataService.getDivisionsByDirectorate as jest.Mock).mockResolvedValue(mockDivisions);
      
      const { result } = renderHook(() => useStep3Data(true));

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

    it('mengelola pencarian direktorat dengan debounce dan pemetaan opsi', async () => {
      (employeeMasterDataService.getDirectorateDropdown as jest.Mock).mockResolvedValue([
        { id: 'd1', directorate_name: 'Direktorat A' },
      ]);

      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handleDirectorateSearch('Dir');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.directorateOptions).toEqual([
          { value: 'd1', label: 'Direktorat A' },
        ]);
      });
    });

    it('mengelola pencarian posisi dengan debounce dan pemetaan opsi', async () => {
      (employeeMasterDataService.getPositionDropdown as jest.Mock).mockResolvedValue([
        { id: 'p1', position_name: 'Posisi A' },
      ]);

      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handlePositionSearch('Pos');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.positionOptions).toEqual([
          { value: 'p1', label: 'Posisi A' },
        ]);
      });
    });

    it('mengelola pencarian kategori karyawan dengan debounce dan set opsi', async () => {
      (useFormulirKaryawan.getEmployeeCategoryDropdownOptions as jest.Mock).mockResolvedValue([
        { value: 'k1', label: 'Tetap' },
      ]);

      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handleEmployeeCategorySearch('Kat');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.kategoriKaryawanOptions).toEqual([
          { value: 'k1', label: 'Tetap' },
        ]);
      });
    });

    it('mengelola pencarian level posisi dengan debounce dan set opsi', async () => {
      (useFormulirKaryawan.getPositionLevelDropdownOptions as jest.Mock).mockResolvedValue([
        { value: 'l1', label: 'Level 1' },
      ]);

      const { result } = renderHook(() => useStep3Data(true));

      act(() => {
        result.current.handlePositionLevelSearch('Lev');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(result.current.positionLevelOptions).toEqual([
          { value: 'l1', label: 'Level 1' },
        ]);
      });
    });
  });

  describe('useStep4Data', () => {
    beforeEach(() => {
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: {
          step1: { statusMenikah: 'single', jumlahTanggungan: '0' },
          step3: { nonFixAllowances: [] },
          step3Employee: { jenjangJabatan: 'L1', jabatan: 'J1', kategoriKaryawan: 'K1' },
          step4: { bank: '', noRekening: '', namaAkunBank: '' },
        },
        updateStep3: jest.fn(),
        updateStep4: jest.fn(),
      });

      (useFormulirKaryawan.getBankDropdownOptions as jest.Mock).mockResolvedValue([
        { value: 'b1', label: 'Bank A' },
      ]);
    });

    it('mengambil opsi bank ketika isOpen true', async () => {
      const { result } = renderHook(() => useStep4Data(true));

      await waitFor(() => {
        expect(result.current.bankOptions).toEqual([{ value: 'b1', label: 'Bank A' }]);
      });
    });

    it('tidak memanggil getBankDropdownOptions ketika isOpen false', () => {
      renderHook(() => useStep4Data(false));
      expect(useFormulirKaryawan.getBankDropdownOptions).not.toHaveBeenCalled();
    });
  });

  describe('useStep5Data', () => {
    const mockUpdateStep4 = jest.fn();
    const baseStep3 = { kategoriKaryawan: 'cat-1' };

    beforeEach(() => {
      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: { step3Employee: baseStep3, step4: { documents: [] } },
        updateStep4: mockUpdateStep4,
      });

      (useFormulirKaryawan.getFieldDocument as jest.Mock).mockResolvedValue([
        { id: 'd1', document_category: 'Pribadi' },
        { id: 'd2', document_category: 'Legal' },
      ]);
    });

    it('mengambil dan memisahkan dokumen personal dan legal berdasarkan kategori', async () => {
      const { result } = renderHook(() => useStep5Data());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.personalDocuments).toHaveLength(1);
        expect(result.current.legalDocuments).toHaveLength(1);
      });

      expect(useFormulirKaryawan.getFieldDocument).toHaveBeenCalledWith('cat-1');
    });

    it('menambahkan dokumen baru saat handleFileChange dipanggil dengan file', () => {
      (useFormulirKaryawan.getFieldDocument as jest.Mock).mockResolvedValue([]);

      const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
      const { result } = renderHook(() => useStep5Data());

      act(() => {
        result.current.handleFileChange('field1', {
          target: { files: [file] },
        } as any);
      });

      const lastCall = (mockUpdateStep4 as jest.Mock).mock.calls.pop()[0];
      expect(lastCall.documents).toHaveLength(1);
      expect(lastCall.documents[0].tipeFile).toBe('field1');
      expect(lastCall.documents[0].namaFile).toBe('doc.pdf');
      expect(lastCall.documents[0].file).toBe(file);
      expect(lastCall.documents[0].filePath).toBe('mock-url');
    });

    it('menghapus dokumen ketika file dihapus', () => {
      const existingDoc = {
        tipeFile: 'field1',
        namaFile: 'lama.pdf',
        file: null,
        filePath: 'mock-url',
      };

      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: {
          step3Employee: baseStep3,
          step4: { documents: [existingDoc] },
        },
        updateStep4: mockUpdateStep4,
      });

      (useFormulirKaryawan.getFieldDocument as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useStep5Data());

      act(() => {
        result.current.handleFileChange('field1', {
          target: { files: [] },
        } as any);
      });

      const lastCall = (mockUpdateStep4 as jest.Mock).mock.calls.pop()[0];
      expect(lastCall.documents).toHaveLength(0);
    });

    it('mengembalikan dokumen tertentu melalui getFileForField', () => {
      const existingDoc = {
        tipeFile: 'field2',
        namaFile: 'file.pdf',
        file: null,
        filePath: 'mock-url',
      };

      (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: {
          step3Employee: baseStep3,
          step4: { documents: [existingDoc] },
        },
        updateStep4: mockUpdateStep4,
      });

      (useFormulirKaryawan.getFieldDocument as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useStep5Data());
      const found = result.current.getFileForField('field2');

      expect(found).toEqual(existingDoc);
    });
  });
});
