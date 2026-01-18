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

  it('meneruskan FormData ke apiService.post saat create dipanggil', async () => {
    const formData = new FormData();
    formData.append('bl_name', 'Lini Bisnis A');
    formData.append('bl_decree_number', 'MEMO-01');
    formData.append('bl_description', 'Deskripsi');
    const file = new File(['dummy'], 'memo.pdf');
    formData.append('bl_decree_file', file);
    const mockResponse = { data: { id: '1' } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.create(formData);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/business-lines');
    expect(body).toBe(formData);
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result).toBe(mockResponse);
  });

  it('meneruskan FormData ke apiService.post saat update dipanggil', async () => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('bl_name', 'Lini Bisnis B');
    formData.append('bl_decree_number', 'MEMO-02');
    formData.append('bl_description', 'Deskripsi Update');
    const file = new File(['dummy'], 'memo-update.pdf');
    formData.append('bl_decree_file', file);
    const mockResponse = { data: { id: '2' } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.update('2', formData);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/business-lines/2/update');
    expect(body).toBe(formData);
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result).toBe(mockResponse);
  });

  it('meneruskan FormData ke apiService.post saat delete dipanggil', async () => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    formData.append('bl_delete_decree_number', 'MEMO-03');
    const file = new File(['dummy'], 'memo-delete.pdf');
    formData.append('bl_delete_decree_file', file);
    const mockResponse = { data: { success: true } };
    mockedApiService.post.mockResolvedValue(mockResponse as any);

    const result = await businessLinesService.delete('3', formData);

    expect(mockedApiService.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = mockedApiService.post.mock.calls[0];

    expect(url).toBe('/organizational-structure/business-master-data/business-lines3');
    expect(body).toBe(formData);
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result).toBe(mockResponse);
  });
});

