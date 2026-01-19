import { act, renderHook } from '@testing-library/react';
import { useDeleteUnitModal } from './useDeleteUnitModal';
import { useDeleteUnit } from '../../api/useApiUnits';
import { addNotification } from '@/stores/notificationStore';

jest.mock('../../api/useApiUnits', () => ({
  useCreateUnit: jest.fn(),
  useGetUnits: jest.fn(),
  useGetUnitById: jest.fn(),
  useUpdateUnit: jest.fn(),
  useDeleteUnit: jest.fn(),
}));

jest.mock('@/stores/fileStore', () => {
  let skFileMock: any = null;
  const setSkFileMock = jest.fn((next: any) => {
    skFileMock = next;
  });
  const clearSkFileMock = jest.fn(() => {
    skFileMock = null;
  });

  const useFileStoreMock = (selector: any) =>
    selector({
      skFile: skFileMock,
      setSkFile: setSkFileMock,
      clearSkFile: clearSkFileMock,
    });

  (useFileStoreMock as any).getState = () => ({
    skFile: skFileMock,
    setSkFile: setSkFileMock,
    clearSkFile: clearSkFileMock,
  });

  return {
    __esModule: true,
    useFileStore: useFileStoreMock,
    __mock: {
      setSkFile: (next: any) => {
        skFileMock = next;
      },
      getSkFile: () => skFileMock,
      clearSkFileMock,
      setSkFileMock,
    },
  };
});

jest.mock('@/stores/notificationStore', () => ({
  addNotification: jest.fn(),
}));

const mockedUseDeleteUnit = useDeleteUnit as unknown as jest.Mock;

describe('useDeleteUnitModal', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  const unit = { id: 'unit-1' } as any;

  const fileStoreMock = jest.requireMock('@/stores/fileStore') as any;
  const { setSkFile, getSkFile, clearSkFileMock, setSkFileMock } =
    fileStoreMock.__mock;

  const deleteUnitExecuteMock = jest.fn();

  beforeAll(() => {
    (globalThis as any).URL = {
      ...(globalThis as any).URL,
      createObjectURL: jest.fn(() => 'blob:mock-url'),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setSkFile(null);

    deleteUnitExecuteMock.mockReset();

    mockedUseDeleteUnit.mockReturnValue({
      execute: deleteUnitExecuteMock,
      loading: false,
      error: null,
    });
  });

  it('tidak melakukan apapun ketika unit tidak memiliki id', async () => {
    const { result } = renderHook(() =>
      useDeleteUnitModal({ isOpen: true, onClose, unit: null, onSuccess })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteUnitExecuteMock).not.toHaveBeenCalled();
    expect(addNotification).not.toHaveBeenCalled();
  });

  it('menampilkan notifikasi error ketika memoNumber atau file tidak diisi', async () => {
    const { result } = renderHook(() =>
      useDeleteUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteUnitExecuteMock).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Unit tidak dihapus',
        description: 'No. SK/Memo dan File Wajib di isi',
      })
    );
  });

  it('memanggil API dan callback ketika delete berhasil', async () => {
    const file = new File(['dummy'], 'memo.pdf', { type: 'application/pdf' });
    setSkFile({ file, name: 'memo.pdf' });

    deleteUnitExecuteMock.mockResolvedValue({});

    const { result } = renderHook(() =>
      useDeleteUnitModal({ isOpen: false, onClose, unit, onSuccess })
    );

    act(() => {
      result.current.setMemoNumber('MEMO-001');
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteUnitExecuteMock).toHaveBeenCalledTimes(1);
    const [calledId, payload] = deleteUnitExecuteMock.mock.calls[0];
    expect(calledId).toBe('unit-1');
    expect(payload.memoNumber).toBe('MEMO-001');
    expect(payload.skFile).toBeInstanceOf(File);

    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'success',
        title: 'Berhasil',
        description: 'Unit berhasil dihapus',
      })
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('mengubah file di store ketika handleFileChange dipanggil', () => {
    const { result } = renderHook(() =>
      useDeleteUnitModal({ isOpen: false, onClose, unit, onSuccess })
    );

    const file = new File(['dummy'], 'memo.pdf', { type: 'application/pdf' });
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(setSkFileMock).toHaveBeenCalledTimes(1);
    const meta = setSkFileMock.mock.calls[0][0];
    expect(meta.name).toBe('memo.pdf');
    expect(meta.file).toBe(file);
  });

  it('mereset memoNumber dan file ketika modal dibuka', () => {
    setSkFile({ file: new File(['x'], 'x.pdf'), name: 'x.pdf' });

    const { result, rerender } = renderHook(
      (props: any) => useDeleteUnitModal(props),
      {
        initialProps: { isOpen: false, onClose, unit, onSuccess },
      }
    );

    act(() => {
      result.current.setMemoNumber('MEMO');
    });

    rerender({ isOpen: true, onClose, unit, onSuccess });

    expect(clearSkFileMock).toHaveBeenCalledTimes(1);
    expect(result.current.memoNumber).toBe('');
    expect(getSkFile()).toBeNull();
  });
});
