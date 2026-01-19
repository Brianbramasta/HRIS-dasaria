import { act, renderHook } from '@testing-library/react';
import { useAddUnitModal } from './useAddUnitModal';
import { useCreateUnit, useGetUnits } from '../../api/useApiUnits';
import { useDepartments } from '../../useDepartments';
import { addNotification } from '@/stores/notificationStore';

jest.mock('../../api/useApiUnits', () => ({
  useCreateUnit: jest.fn(),
  useGetUnits: jest.fn(),
  useGetUnitById: jest.fn(),
  useUpdateUnit: jest.fn(),
  useDeleteUnit: jest.fn(),
}));

jest.mock('../../useDepartments', () => ({
  useDepartments: jest.fn(),
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

const mockedUseCreateUnit = useCreateUnit as unknown as jest.Mock;
const mockedUseGetUnits = useGetUnits as unknown as jest.Mock;
const mockedUseDepartments = useDepartments as unknown as jest.Mock;

describe('useAddUnitModal', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  const fileStoreMock = jest.requireMock('@/stores/fileStore') as any;
  const { setSkFile, getSkFile, clearSkFileMock, setSkFileMock } =
    fileStoreMock.__mock;

  const createUnitExecuteMock = jest.fn();
  const getUnitsExecuteMock = jest.fn();
  const getDropdownMock = jest.fn();

  beforeAll(() => {
    (globalThis as any).URL = {
      ...(globalThis as any).URL,
      createObjectURL: jest.fn(() => 'blob:mock-url'),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setSkFile(null);

    createUnitExecuteMock.mockReset();
    getUnitsExecuteMock.mockReset();
    getDropdownMock.mockReset();

    mockedUseCreateUnit.mockReturnValue({
      execute: createUnitExecuteMock,
      loading: false,
      error: null,
    });

    mockedUseGetUnits.mockReturnValue({
      execute: getUnitsExecuteMock,
      loading: false,
      error: null,
    });

    mockedUseDepartments.mockReturnValue({
      getDropdown: getDropdownMock,
    });
  });

  it('menampilkan notifikasi error ketika field wajib kosong', async () => {
    const { result } = renderHook(() =>
      useAddUnitModal({ isOpen: false, onClose, onSuccess })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createUnitExecuteMock).not.toHaveBeenCalled();
    expect(getUnitsExecuteMock).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Unit tidak ditambahkan',
        description:
          'Nama Unit, Departemen, No. SK/Memo, dan File wajib diisi',
      })
    );
  });

  it('memanggil API dan callback ketika submit berhasil', async () => {
    const file = new File(['dummy'], 'memo.pdf', { type: 'application/pdf' });
    setSkFile({ file, name: 'memo.pdf' });

    createUnitExecuteMock.mockResolvedValue({ data: { id: '1' } });
    getUnitsExecuteMock.mockResolvedValue({});

    const { result } = renderHook(() =>
      useAddUnitModal({ isOpen: false, onClose, onSuccess })
    );

    act(() => {
      result.current.setName('Nama Unit');
      result.current.setDepartmentId('dept-1');
      result.current.setMemoNumber('MEMO-001');
      result.current.setDescription('Deskripsi');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createUnitExecuteMock).toHaveBeenCalledTimes(1);
    const payload = createUnitExecuteMock.mock.calls[0][0];
    expect(payload.name).toBe('Nama Unit');
    expect(payload.departmentId).toBe('dept-1');
    expect(payload.memoNumber).toBe('MEMO-001');
    expect(payload.description).toBe('Deskripsi');
    expect(payload.skFile).toBeInstanceOf(File);

    expect(getUnitsExecuteMock).toHaveBeenCalledTimes(1);
    expect(getUnitsExecuteMock).toHaveBeenCalledWith({});

    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'success',
        title: 'Berhasil',
        description: 'Unit berhasil ditambahkan',
      })
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('mengubah file di store ketika handleFileChange dipanggil', () => {
    const { result } = renderHook(() =>
      useAddUnitModal({ isOpen: false, onClose, onSuccess })
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

  it('mengambil dan memetakan departemen ketika handleSearchDepartments dipanggil', async () => {
    getDropdownMock.mockResolvedValue([
      { id: '1', department_name: 'IT' },
      { id: '2', department_name: 'HR' },
    ]);

    const { result } = renderHook(() =>
      useAddUnitModal({ isOpen: false, onClose, onSuccess })
    );

    await act(async () => {
      await result.current.handleSearchDepartments('it');
    });

    expect(getDropdownMock).toHaveBeenCalledWith('it');
    expect(result.current.departments).toEqual([
      { value: '1', label: 'IT' },
      { value: '2', label: 'HR' },
    ]);
  });

  it('mereset state dan menghapus file ketika modal dibuka', () => {
    setSkFile({ file: new File(['x'], 'x.pdf'), name: 'x.pdf' });

    const { result, rerender } = renderHook(
      (props: any) => useAddUnitModal(props),
      {
        initialProps: { isOpen: false, onClose, onSuccess },
      }
    );

    act(() => {
      result.current.setName('Nama');
      result.current.setDepartmentId('dept-1');
      result.current.setMemoNumber('MEMO');
      result.current.setDescription('Desc');
    });

    act(() => {
      rerender({ isOpen: true, onClose, onSuccess });
    });

    expect(clearSkFileMock).toHaveBeenCalledTimes(1);
    expect(result.current.name).toBe('');
    expect(result.current.departmentId).toBe('');
    expect(result.current.memoNumber).toBe('');
    expect(result.current.description).toBe('');
    expect(getSkFile()).toBeNull();
  });
});

