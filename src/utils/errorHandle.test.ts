import handleApiError from './errorHandle';

describe('fungsi handleApiError - menangani berbagai bentuk error API', () => {
  const originalAlert = globalThis.alert;
  const alertMock = jest.fn();

  beforeEach(() => {
    alertMock.mockReset();
    (globalThis as any).alert = alertMock;
  });

  afterAll(() => {
    (globalThis as any).alert = originalAlert;
  });

  it('mengembalikan pesan default untuk error null atau undefined', () => {
    const resultNull = handleApiError(null);
    const resultUndefined = handleApiError(undefined);

    expect(resultNull).toEqual(['Unknown error']);
    expect(resultUndefined).toEqual(['Unknown error']);
    expect(alertMock).toHaveBeenCalledTimes(2);
    expect(alertMock).toHaveBeenNthCalledWith(1, 'Unknown error');
    expect(alertMock).toHaveBeenNthCalledWith(2, 'Unknown error');
  });

  it('mengembalikan pesan ketika error berupa string', () => {
    const result = handleApiError('Terjadi kesalahan jaringan');

    expect(result).toEqual(['Terjadi kesalahan jaringan']);
    expect(alertMock).toHaveBeenCalledWith('Terjadi kesalahan jaringan');
  });

  it('mengambil pesan dari struktur error gaya Axios dengan meta dan errors', () => {
    const error = {
      response: {
        data: {
          meta: { message: 'Gagal validasi' },
          errors: {
            field1: ['Error 1', 'Error 2'],
            field2: 'Error 3',
          },
        },
      },
    };

    const result = handleApiError(error);

    expect(result).toEqual(['Gagal validasi', 'Error 1', 'Error 2', 'Error 3']);
    expect(alertMock).toHaveBeenCalledWith('Gagal validasi\nError 1\nError 2\nError 3');
  });

  it('mengambil pesan dari properti meta dan message langsung pada objek error', () => {
    const error = {
      meta: { message: 'Token kadaluarsa' },
      message: 'Silakan login kembali',
    };

    const result = handleApiError(error);

    expect(result).toEqual(['Token kadaluarsa', 'Silakan login kembali']);
    expect(alertMock).toHaveBeenCalledWith('Token kadaluarsa\nSilakan login kembali');
  });

  it('menggunakan pesan cadangan ketika tidak ada informasi error yang bisa diambil', () => {
    const result = handleApiError({});

    expect(result).toEqual(['Terjadi kesalahan. Silakan coba lagi.']);
    expect(alertMock).toHaveBeenCalledWith('Terjadi kesalahan. Silakan coba lagi.');
  });
});

