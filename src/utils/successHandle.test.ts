import { handleApiSuccess } from './successHandle';
import { addNotification } from '../stores/notificationStore';

jest.mock('../stores/notificationStore', () => ({
  addNotification: jest.fn(),
}));

describe('fungsi handleApiSuccess - menampilkan notifikasi sukses dari respons API', () => {
  const mockedAddNotification = addNotification as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('memanggil addNotification ketika meta.message tersedia', () => {
    const response = {
      meta: {
        message: 'Data berhasil disimpan',
      },
    };

    handleApiSuccess(response as any);

    expect(mockedAddNotification).toHaveBeenCalledTimes(1);
    expect(mockedAddNotification).toHaveBeenCalledWith({
      title: 'Berhasil',
      description: 'Data berhasil disimpan',
      variant: 'success',
    });
  });

  it('tidak memanggil addNotification ketika meta.message tidak ada', () => {
    const responseTanpaMeta = {};
    const responseTanpaMessage = { meta: {} };

    handleApiSuccess(responseTanpaMeta as any);
    handleApiSuccess(responseTanpaMessage as any);

    expect(mockedAddNotification).not.toHaveBeenCalled();
  });
});

