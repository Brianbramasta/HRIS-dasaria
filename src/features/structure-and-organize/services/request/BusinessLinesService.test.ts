import { businessLinesService } from './BusinessLinesService';
import { apiService } from '../../../../services/api';

const mockedApiService = apiService as unknown as {
  buildQueryString: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
};

jest.mock('../../../../services/api', () => ({
  apiService: {
    buildQueryString: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('BusinessLinesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('memanggil apiService.get dengan URL yang benar saat getList dipanggil dengan filter', async () => {
    mockedApiService.buildQueryString.mockReturnValue('page=2&search=test');
    const mockResponse = { data: { data: [], total: 0 } };
    mockedApiService.get.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.getList({ page: 2, search: 'test' });

    expect(mockedApiService.buildQueryString).toHaveBeenCalledWith({ page: 2, search: 'test' });
    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines?page=2&search=test'
    );
    expect(result).toBe(mockResponse);
  });

  it('memanggil apiService.get dengan URL dasar saat getList dipanggil tanpa query string', async () => {
    mockedApiService.buildQueryString.mockReturnValue('');
    const mockResponse = { data: { data: [], total: 0 } };
    mockedApiService.get.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.getList({});

    expect(mockedApiService.buildQueryString).toHaveBeenCalledWith({});
    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines'
    );
    expect(result).toBe(mockResponse);
  });

  it('memanggil apiService.get untuk getDropdown dengan dan tanpa parameter pencarian', async () => {
    const mockResponse = { data: [] };
    mockedApiService.get.mockResolvedValue(mockResponse as any);

    const resultSearch = await businessLinesService.getDropdown('Lini Bisnis');
    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines-dropdown?search=Lini%20Bisnis'
    );
    expect(resultSearch).toBe(mockResponse);

    mockedApiService.get.mockClear();
    const resultNoSearch = await businessLinesService.getDropdown();
    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines-dropdown'
    );
    expect(resultNoSearch).toBe(mockResponse);
  });

  it('memanggil apiService.get dengan path detail yang benar saat getDetail dipanggil', async () => {
    const mockResponse = { data: { id: '1' } };
    mockedApiService.get.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.getDetail('1');

    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines/1/detail'
    );
    expect(result).toBe(mockResponse);
  });

  it('memanggil apiService.get dengan path show yang benar saat getById dipanggil', async () => {
    const mockResponse = { data: { id: '1' } };
    mockedApiService.get.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.getById('1');

    expect(mockedApiService.get).toHaveBeenCalledWith(
      '/organizational-structure/business-master-data/business-lines/1/show'
    );
    expect(result).toBe(mockResponse);
  });

  it('membuat FormData yang benar saat create dipanggil', async () => {
    const file = new File(['dummy'], 'memo.pdf');
    const payload = {
      name: 'Lini Bisnis A',
      description: 'Deskripsi',
      memoNumber: 'MEMO-01',
      skFile: file,
    };
    const mockResponse = { data: { id: '1' } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.create(payload);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, formData, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/');
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(formData instanceof FormData).toBe(true);
    const fd = formData as FormData;
    expect(fd.get('bl_name')).toBe('Lini Bisnis A');
    expect(fd.get('bl_decree_number')).toBe('MEMO-01');
    expect(fd.get('bl_description')).toBe('Deskripsi');
    expect(fd.get('bl_decree_file')).toBe(file);
    expect(result).toBe(mockResponse);
  });

  it('membuat FormData yang benar saat update dipanggil', async () => {
    const file = new File(['dummy'], 'memo-update.pdf');
    const payload = {
      name: 'Lini Bisnis B',
      description: 'Deskripsi Update',
      memoNumber: 'MEMO-02',
      skFile: file,
    };
    const mockResponse = { data: { id: '2' } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.update('2', payload);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, formData, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/business-lines/2/update');
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(formData instanceof FormData).toBe(true);
    const fd = formData as FormData;
    expect(fd.get('_method')).toBe('PATCH');
    expect(fd.get('bl_name')).toBe('Lini Bisnis B');
    expect(fd.get('bl_decree_number')).toBe('MEMO-02');
    expect(fd.get('bl_description')).toBe('Deskripsi Update');
    expect(fd.get('bl_decree_file')).toBe(file);
    expect(result).toBe(mockResponse);
  });

  it('membuat FormData yang benar saat delete dipanggil', async () => {
    const file = new File(['dummy'], 'memo-delete.pdf');
    const payload = {
      memoNumber: 'MEMO-03',
      skFile: file,
    };
    const mockResponse = { data: { success: true } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.delete('3', payload);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, formData, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/business-lines3');
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(formData instanceof FormData).toBe(true);
    const fd = formData as FormData;
    expect(fd.get('_method')).toBe('DELETE');
    expect(fd.get('bl_delete_decree_number')).toBe('MEMO-03');
    expect(fd.get('bl_delete_decree_file')).toBe(file);
    expect(result).toBe(mockResponse);
  });
});

