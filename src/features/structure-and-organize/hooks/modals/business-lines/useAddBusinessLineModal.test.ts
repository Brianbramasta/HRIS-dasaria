import { act, renderHook } from '@testing-library/react';
import { useAddBusinessLineModal } from './useAddBusinessLineModal';
import { businessLinesService } from '../../../services/request/BusinessLinesService';
import { addNotification } from '@/stores/notificationStore';

jest.mock('../../../services/request/BusinessLinesService', () => ({
  businessLinesService: {
    create: jest.fn(),
  },
}));

jest.mock('@/stores/fileStore', () => {
  const clearSkFileMock = jest.fn();
  let skFileMock: any = null;

  const useFileStoreMock = (selector: any) =>
    selector({ skFile: skFileMock, clearSkFile: clearSkFileMock });

  (useFileStoreMock as any).getState = () => ({ clearSkFile: clearSkFileMock });

  return {
    __esModule: true,
    useFileStore: useFileStoreMock,
    __mock: {
      setSkFile: (next: any) => {
        skFileMock = next;
      },
      clearSkFileMock,
    },
  };
});

jest.mock('@/stores/notificationStore', () => ({
  addNotification: jest.fn(),
}));

describe('useAddBusinessLineModal', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  const fileStoreMock = jest.requireMock('@/stores/fileStore') as any;
  const { setSkFile, clearSkFileMock } = fileStoreMock.__mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setSkFile(null);
  });

  it('tidak memanggil API ketika nama kosong', async () => {
    setSkFile({ file: new File(['dummy'], 'dummy.pdf') });

    const { result } = renderHook(() =>
      useAddBusinessLineModal({ onClose, onSuccess })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(businessLinesService.create).not.toHaveBeenCalled();
    expect(addNotification).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it('menampilkan notifikasi error ketika file SK tidak diisi', async () => {
    const { result } = renderHook(() =>
      useAddBusinessLineModal({ onClose, onSuccess })
    );

    act(() => {
      result.current.setName('Lini Bisnis A');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(businessLinesService.create).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Lini Bisnis tidak ditambahkan',
        description: 'File Wajib di isi',
      })
    );
    expect(result.current.submitting).toBe(false);
  });

  it('memanggil API dan callback ketika submit berhasil', async () => {
    const created = { id: '1', name: 'Lini Bisnis A' } as any;

    (businessLinesService.create as jest.Mock).mockResolvedValue(created);

    setSkFile({ file: new File(['dummy'], 'memo.pdf'), name: 'memo.pdf' });

    const { result } = renderHook(() =>
      useAddBusinessLineModal({ onClose, onSuccess })
    );

    act(() => {
      result.current.setName('  Lini Bisnis A  ');
      result.current.setMemoNumber('  MEMO-001  ');
      result.current.setDescription('  Deskripsi  ');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(businessLinesService.create).toHaveBeenCalledTimes(1);
    expect(businessLinesService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Lini Bisnis A',
        memoNumber: 'MEMO-001',
        description: 'Deskripsi',
        skFile: expect.any(File),
      })
    );

    expect(onSuccess).toHaveBeenCalledWith(created);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(clearSkFileMock).toHaveBeenCalledTimes(1);

    expect(result.current.name).toBe('');
    expect(result.current.memoNumber).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.submitting).toBe(false);
  });

  it('menampilkan notifikasi error ketika submit gagal', async () => {
    (businessLinesService.create as jest.Mock).mockRejectedValue(
      new Error('Gagal')
    );

    setSkFile({ file: new File(['dummy'], 'memo.pdf'), name: 'memo.pdf' });

    const { result } = renderHook(() =>
      useAddBusinessLineModal({ onClose, onSuccess })
    );

    act(() => {
      result.current.setName('Lini Bisnis A');
      result.current.setMemoNumber('MEMO-001');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(businessLinesService.create).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Lini Bisnis tidak ditambahkan',
        description: 'Gagal menambahkan lini bisnis. Silakan coba lagi.',
      })
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(clearSkFileMock).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });
});

