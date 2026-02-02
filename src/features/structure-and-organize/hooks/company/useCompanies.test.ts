import { renderHook, act, waitFor } from '@testing-library/react';
import { useCompanies } from './useCompanies';
import { mapToCompanyDetail } from '../api/useApiCompanies';
import { companiesService } from '../../services/request/CompaniesService';
import useFilterStore from '../../../../stores/filterStore';
import type { CompanyDetailResponse } from '../../types/OrganizationApiTypes';

jest.mock('../../../../services/api', () => ({
  apiService: {},
}));
jest.mock('../../services/request/CompaniesService');
jest.mock('../../../../stores/filterStore');
jest.mock('../../utils/shared/toFileSummary', () => ({
  toFileSummary: (url: string | null) => (url ? { name: 'mock-sk', url } : null),
}));

const mockCompaniesService = companiesService as jest.Mocked<typeof companiesService>;
const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

describe('hook useCompanies - perusahaan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockImplementation((selector) => {
      const state = { filters: { Perusahaan: '' } };
      return selector(state);
    });
  });

  it('harus menginisialisasi state default dengan benar', async () => {
    mockCompaniesService.getList.mockResolvedValue({
      data: { data: [], total: 0, per_page: 10, last_page: 1 },
    } as any);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.companies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.search).toBe('');
    expect(result.current.sortBy).toBe('');
    expect(result.current.sortOrder).toBeNull();
    expect(result.current.filterValue).toBe('');
  });

  it('harus mengambil daftar perusahaan dan memetakan data dengan benar', async () => {
    const apiItem = {
      id: '1',
      company_name: 'Perusahaan A',
      company_description: 'Deskripsi A',
      business_line_name: 'Lini A',
      company_decree_number: 'SK-1',
      company_decree_file: 'http://file.test/sk-1.pdf',
    };
    const mockResponse = {
      data: {
        data: [apiItem],
        total: 1,
        per_page: 10,
        last_page: 1,
      },
    };
    mockCompaniesService.getList.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockCompaniesService.getList).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, per_page: 10 }),
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.companies).toHaveLength(1);
    const company = result.current.companies[0];
    expect(company.id).toBe('1');
    expect(company.name).toBe('Perusahaan A');
    expect(company.description).toBe('Deskripsi A');
    expect(company.businessLineName).toBe('Lini A');
    expect(company.memoNumber).toBe('SK-1');
    expect(company.skFile).toEqual({ name: 'mock-sk', url: 'http://file.test/sk-1.pdf' });
    expect(result.current.total).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('harus meneruskan filter dari store ke parameter API', async () => {
    mockUseFilterStore.mockImplementation((selector) => {
      const state = { filters: { Perusahaan: 'aktif' } };
      return selector(state);
    });
    mockCompaniesService.getList.mockResolvedValue({
      data: { data: [], total: 0, per_page: 10, last_page: 1 },
    } as any);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockCompaniesService.getList).toHaveBeenCalledWith(
      expect.objectContaining({ filter: 'aktif' }),
    );
  });

  it('harus mengatur error ketika fetchCompanies gagal', async () => {
    mockCompaniesService.getList.mockRejectedValueOnce(new Error('Gagal ambil data'));

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Gagal ambil data');
  });

  it('harus memperbarui pagination, search, dan sort state', () => {
    const { result } = renderHook(() => useCompanies());

    act(() => {
      result.current.setPage(2);
      result.current.setPageSize(20);
      result.current.setSearch('cari');
      result.current.setSort('Nama Perusahaan', 'asc');
    });

    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.search).toBe('cari');
    expect(result.current.sortBy).toBe('Nama Perusahaan');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('harus membuat perusahaan baru dengan sukses', async () => {
    const payload = {
      name: 'Perusahaan Baru',
      businessLineId: 'bl-1',
      memoNumber: 'SK-2',
      skFileId: 'file-1',
    } as any;
    const apiCompany = {
      id: '2',
      company_name: payload.name,
      business_line_name: 'Lini B',
      company_decree_number: payload.memoNumber,
      company_decree_file: 'http://file.test/sk-2.pdf',
    };
    const mockCreateResponse = {
      data: {
        company: apiCompany,
      },
    };
    mockCompaniesService.create.mockResolvedValueOnce(mockCreateResponse as any);
    mockCompaniesService.getList.mockResolvedValue({
      data: { data: [], total: 0, per_page: 10, last_page: 1 },
    } as any);

    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let created: any = null;
    await act(async () => {
      created = await result.current.createCompany(payload);
    });

    expect(mockCompaniesService.create).toHaveBeenCalledWith(expect.any(FormData));
    expect(created).not.toBeNull();
    expect(created?.name).toBe('Perusahaan Baru');
    expect(mockCompaniesService.getList).toHaveBeenCalled();
  });

  it('harus mengatur error ketika createCompany gagal', async () => {
    mockCompaniesService.create.mockRejectedValueOnce(new Error('Gagal membuat perusahaan'));
    mockCompaniesService.getList.mockResolvedValue({
        data: { data: [], total: 0, per_page: 10, last_page: 1 },
      } as any);

    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let created: any = null;
    await act(async () => {
      created = await result.current.createCompany({
        name: 'Gagal',
        businessLineId: 'bl-1',
        memoNumber: 'SK-X',
        skFileId: 'file-x',
      } as any);
    });

    expect(created).toBeNull();
    expect(result.current.error).toBe('Gagal membuat perusahaan');
  });

  it('harus memperbarui perusahaan dengan sukses', async () => {
    const updatePayload = {
      name: 'Perusahaan Update',
      memoNumber: 'SK-3',
      skFileId: 'file-3',
    } as any;
    const apiCompany = {
      id: '3',
      company_name: updatePayload.name,
      company_decree_number: updatePayload.memoNumber,
    };
    const mockUpdateResponse = {
      data: {
        company: apiCompany,
      },
    };
    mockCompaniesService.update.mockResolvedValueOnce(mockUpdateResponse as any);
    mockCompaniesService.getList.mockResolvedValue({
      data: { data: [], total: 0, per_page: 10, last_page: 1 },
    } as any);

    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let updated: any = null;
    await act(async () => {
      updated = await result.current.updateCompany('3', updatePayload);
    });

    expect(mockCompaniesService.update).toHaveBeenCalledWith('3', expect.any(FormData));
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Perusahaan Update');
    expect(mockCompaniesService.getList).toHaveBeenCalled();
  });

  it('harus menghapus perusahaan dengan sukses', async () => {
    const deletePayload = { memoNumber: 'SK-4', skFile: {} as File };
    const mockDeleteResponse = {
      data: {
        meta: { status: 200 },
      },
    };
    mockCompaniesService.delete.mockResolvedValueOnce(mockDeleteResponse as any);
    mockCompaniesService.getList.mockResolvedValue({
      data: { data: [], total: 0, per_page: 10, last_page: 1 },
    } as any);

    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = false;
    await act(async () => {
      success = await result.current.deleteCompany('4', deletePayload);
    });

    expect(mockCompaniesService.delete).toHaveBeenCalledWith('4', expect.any(FormData));
    expect(success).toBe(true);
    expect(mockCompaniesService.getList).toHaveBeenCalled();
  });

  it('harus mengembalikan false ketika deleteCompany gagal', async () => {
    mockCompaniesService.delete.mockRejectedValueOnce(new Error('Gagal hapus'));
    mockCompaniesService.getList.mockResolvedValue({
        data: { data: [], total: 0, per_page: 10, last_page: 1 },
      } as any);

    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.deleteCompany('5', {
        memoNumber: 'SK-5',
        skFile: {} as File,
      });
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Gagal hapus');
  });

  it('harus mendapatkan dropdown perusahaan', async () => {
    const mockDropdownResponse = {
      data: [
        { id: '1', company_name: 'Perusahaan 1' },
        { id: '2', company_name: 'Perusahaan 2' },
      ],
    };
    mockCompaniesService.getDropdown.mockResolvedValueOnce(mockDropdownResponse as any);

    const { result } = renderHook(() => useCompanies());

    let dropdown: any[] = [];
    await act(async () => {
      dropdown = await result.current.getDropdown();
    });

    expect(mockCompaniesService.getDropdown).toHaveBeenCalled();
    expect(dropdown).toEqual(mockDropdownResponse.data);
  });

  it('harus memanggil service getDetail dan mengembalikan response', async () => {
    const mockDetailResponse = { data: { id: '10', company_name: 'Detail Perusahaan' } };
    mockCompaniesService.getDetail.mockResolvedValueOnce(mockDetailResponse as any);

    const { result } = renderHook(() => useCompanies());

    let detail: any;
    await act(async () => {
      detail = await result.current.getDetail('10');
    });

    expect(mockCompaniesService.getDetail).toHaveBeenCalledWith('10');
    expect(detail).toEqual(mockDetailResponse);
  });

  it('harus memetakan detail perusahaan dengan benar pada mapToCompanyDetail', () => {
    const apiResult = {
      data: {
        data: {
          id: '7',
          company_name: 'Perusahaan Detail',
          company_description: 'Deskripsi Detail',
          total_employees: 100,
          postal_code: '12345',
          email: 'detail@company.test',
          phone: '080000000',
          industry: 'Teknologi',
          founded_year: 2020,
          company_type: 'PT',
          website: 'https://company.test',
          created_at: '2024-01-01',
          company_decree_number: 'SK-7',
          company_decree_file: 'http://file.test/sk-7.pdf',
          offices: [
            {
              id_office: 'o-1',
              office_name: 'Kantor 1',
              address: 'Jl. Kantor 1',
              office_employee_count: 10,
            },
          ],
          documents: [
            {
              id: 'd-1',
              cd_name: 'Dokumen 1',
              cd_decree_number: 'SK-D1',
              cd_file: 'http://file.test/d1.pdf',
              deleted_at: null,
            },
          ],
        },
      },
    };

    const mapped: CompanyDetailResponse = mapToCompanyDetail(apiResult as any);

    expect(mapped.company.id).toBe('7');
    expect(mapped.company.name).toBe('Perusahaan Detail');
    expect(mapped.company.description).toBe('Deskripsi Detail');
    expect(mapped.company.employeeCount).toBe(100);
    expect(mapped.company.postalCode).toBe('12345');
    expect(mapped.company.email).toBe('detail@company.test');
    expect(mapped.company.memoNumber).toBe('SK-7');
    expect(mapped.company.skFile).toEqual({ name: 'mock-sk', url: 'http://file.test/sk-7.pdf' });
    expect(mapped.branches).toHaveLength(1);
    expect(mapped.branches[0].name).toBe('Kantor 1');
    expect(mapped.documents).toHaveLength(1);
    expect(mapped.documents[0].fileName).toBe('Dokumen 1');
    expect(mapped.documents[0].number).toBe('SK-D1');
    expect(mapped.documents[0].type).toBe('active');
    expect(mapped.documents[0].fileUrl).toBe('http://file.test/d1.pdf');
  });
});

