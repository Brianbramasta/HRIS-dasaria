import { renderHook, act, waitFor } from '@testing-library/react';
import { useDetailCompany } from './useDetailCompany';
import { companyService } from '../../services/OrganizationService';
import { mapToCompanyDetail } from '../../hooks/api/useApiCompanies';
import { useParams } from 'react-router-dom';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../services/OrganizationService', () => ({
  companyService: {
    getDetail: jest.fn(),
  },
}));

jest.mock('../../hooks/api/useApiCompanies', () => ({
  mapToCompanyDetail: jest.fn(),
}));

jest.mock('@/utils/formatDate', () => ({
  formatDateToIndonesian: jest.fn((date) => (date ? `Formatted ${date}` : '')),
}));

jest.mock('@/stores/fileStore', () => ({
  useFileStore: jest.fn(() => ({})),
}));

describe('useDetailCompany', () => {
  const mockId = '123';
  const mockCompanyDetail = {
    company: {
      id: '123',
      name: 'Test Company',
      address: 'Test Address',
      employeeCount: 50,
      postalCode: '12345',
      email: 'test@example.com',
      phone: '08123456789',
      industry: 'IT',
      founded: '2020-01-01',
      type: 'PT',
      website: 'www.test.com',
    },
    branches: [{ id: 'b1', name: 'Branch 1' }],
    documents: [{ id: 'd1', fileName: 'Doc 1', type: 'active' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: mockId });
  });

  it('harus menginisialisasi dengan nilai default', () => {
    const { result } = renderHook(() => useDetailCompany());

    expect(result.current.id).toBe(mockId);
    expect(result.current.company).toBeNull();
    expect(result.current.branches).toEqual([]);
    expect(result.current.documents).toEqual([]);
    expect(result.current.tab).toBe('profile');
    expect(result.current.isAddBranchOpen).toBe(false);
    expect(result.current.isDeleteBranchOpen).toBe(false);
    expect(result.current.isAddDocOpen).toBe(false);
    expect(result.current.isDeleteDocOpen).toBe(false);
    expect(result.current.isEditDocOpen).toBe(false);
    expect(result.current.isEditOpen).toBe(false);
  });

  it('harus mengambil detail perusahaan saat mount', async () => {
    (companyService.getDetail as jest.Mock).mockResolvedValue('raw-data');
    (mapToCompanyDetail as jest.Mock).mockReturnValue(mockCompanyDetail);

    const { result } = renderHook(() => useDetailCompany());

    await waitFor(() => {
      expect(result.current.company).not.toBeNull();
    });

    expect(companyService.getDetail).toHaveBeenCalledWith(mockId);
    expect(mapToCompanyDetail).toHaveBeenCalledWith('raw-data');
    expect(result.current.company).toEqual(mockCompanyDetail.company);
    expect(result.current.branches).toEqual(mockCompanyDetail.branches);
    expect(result.current.documents).toEqual(mockCompanyDetail.documents);
  });

  it('harus menangani error fetch dengan baik', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (companyService.getDetail as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useDetailCompany());

    await waitFor(() => {
      expect(companyService.getDetail).toHaveBeenCalledWith(mockId);
    });

    expect(result.current.company).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load company detail', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('tidak boleh melakukan fetch jika id tidak ada', async () => {
    (useParams as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useDetailCompany());

    expect(companyService.getDetail).not.toHaveBeenCalled();
    expect(result.current.company).toBeNull();
  });

  it('harus menangani tipe dokumen yang hilang dengan default active', async () => {
    const detailWithMissingDocType = {
      ...mockCompanyDetail,
      documents: [{ id: 'd2', fileName: 'Doc 2' }], // missing type
    };
    (companyService.getDetail as jest.Mock).mockResolvedValue('raw-data');
    (mapToCompanyDetail as jest.Mock).mockReturnValue(detailWithMissingDocType);

    const { result } = renderHook(() => useDetailCompany());

    await waitFor(() => {
      expect(result.current.documents[0].type).toBe('active');
    });
  });

  it('harus memperbarui state tab', () => {
    const { result } = renderHook(() => useDetailCompany());

    act(() => {
      result.current.setTab('dokumen');
    });
    expect(result.current.tab).toBe('dokumen');
  });

  it('harus mengubah status modal (toggle)', () => {
    const { result } = renderHook(() => useDetailCompany());

    act(() => {
      result.current.setAddBranchOpen(true);
      result.current.setEditOpen(true);
      result.current.setAddDocOpen(true);
    });

    expect(result.current.isAddBranchOpen).toBe(true);
    expect(result.current.isEditOpen).toBe(true);
    expect(result.current.isAddDocOpen).toBe(true);
  });

  it('harus menghitung nilai turunan dengan benar', async () => {
     (companyService.getDetail as jest.Mock).mockResolvedValue('raw-data');
    (mapToCompanyDetail as jest.Mock).mockReturnValue(mockCompanyDetail);

    const { result } = renderHook(() => useDetailCompany());

    await waitFor(() => {
      expect(result.current.company).not.toBeNull();
    });

    expect(result.current.alamatValue).toBe(mockCompanyDetail.company.address);
    expect(result.current.companySizeValue).toBe('50 Employes');
    
    const contactInfo = result.current.contactInformation;
    expect(contactInfo.find(i => i.label === 'Kode Pos')?.value).toBe(mockCompanyDetail.company.postalCode);
    expect(contactInfo.find(i => i.label === 'Gmail')?.value).toBe(mockCompanyDetail.company.email);
    
    const customInfo = result.current.customInformation;
    expect(customInfo.find(i => i.label === 'Industry')?.value).toBe(mockCompanyDetail.company.industry);
  });

  it('harus menangani data perusahaan kosong untuk nilai turunan', () => {
     const { result } = renderHook(() => useDetailCompany());

     expect(result.current.alamatValue).toBe('—');
     expect(result.current.companySizeValue).toBe('0');
     expect(result.current.contactInformation[0].value).toBe('—');
  });
});
