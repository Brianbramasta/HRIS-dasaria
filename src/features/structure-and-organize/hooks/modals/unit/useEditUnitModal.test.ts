import { act, renderHook, waitFor } from '@testing-library/react';
import { useEditUnitModal } from './useEditUnitModal';
import {
  useGetUnitById,
  useUpdateUnit,
  useGetUnits,
} from '../../api/useApiUnits';
import { useDepartments } from '../../departement/useDepartments';
import { toFileSummary } from '../../../utils/shared/toFileSummary';
import { addNotification } from '@/stores/notificationStore';

jest.mock('../../api/useApiUnits', () => ({
  useCreateUnit: jest.fn(),
  useGetUnits: jest.fn(),
  useGetUnitById: jest.fn(),
  useUpdateUnit: jest.fn(),
  useDeleteUnit: jest.fn(),
}));

jest.mock('../../departement/useDepartments', () => ({
  useDepartments: jest.fn(),
}));

jest.mock('../../../utils/shared/toFileSummary', () => ({
  toFileSummary: jest.fn(),
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

const mockedUseGetUnitById = useGetUnitById as unknown as jest.Mock;
const mockedUseUpdateUnit = useUpdateUnit as unknown as jest.Mock;
const mockedUseGetUnits = useGetUnits as unknown as jest.Mock;
const mockedUseDepartments = useDepartments as unknown as jest.Mock;
const mockedToFileSummary = toFileSummary as unknown as jest.Mock;

describe('useEditUnitModal', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  const unit = { id: 'unit-1' } as any;

  const fileStoreMock = jest.requireMock('@/stores/fileStore') as any;
  const { setSkFile, getSkFile, clearSkFileMock, setSkFileMock } =
    fileStoreMock.__mock;

  const getUnitByIdExecuteMock = jest.fn();
  const updateUnitExecuteMock = jest.fn();
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

    getUnitByIdExecuteMock.mockReset();
    updateUnitExecuteMock.mockReset();
    getUnitsExecuteMock.mockReset();
    getDropdownMock.mockReset();
    mockedToFileSummary.mockReset();

    mockedUseGetUnitById.mockReturnValue({
      execute: getUnitByIdExecuteMock,
      loading: false,
      error: null,
    });

    mockedUseUpdateUnit.mockReturnValue({
      execute: updateUnitExecuteMock,
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

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('mengambil detail unit saat modal dibuka dan mengisi state awal', async () => {
    const apiResponse = {
      data: {
        unit_name: 'Unit A',
        description: 'Deskripsi',
        unit_decree_number: 'MEMO-001',
        unit_decree_file_url: 'http://file.test/memo.pdf',
        department_id: 'dept-1',
      },
    };

    getUnitByIdExecuteMock.mockResolvedValue(apiResponse);
    mockedToFileSummary.mockReturnValue({
      fileName: 'memo.pdf',
      fileUrl: 'http://file.test/memo.pdf',
      size: '123',
      fileType: 'application/pdf',
    });

    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await waitFor(() => {
      expect(getUnitByIdExecuteMock).toHaveBeenCalledWith('unit-1');
      expect(result.current.name).toBe('Unit A');
      expect(result.current.description).toBe('Deskripsi');
      expect(result.current.memoNumber).toBe('MEMO-001');
      expect(result.current.departmentId).toBe('dept-1');
    });

    expect(mockedToFileSummary).toHaveBeenCalledWith(
      'http://file.test/memo.pdf'
    );
    expect(setSkFileMock).toHaveBeenCalledTimes(1);
    const meta = setSkFileMock.mock.calls[0][0];
    expect(meta.name).toBe('memo.pdf');
    expect(meta.path).toBe('http://file.test/memo.pdf');
    expect(meta.size).toBe(123);
    expect(meta.type).toBe('application/pdf');
  });

  it('menampilkan notifikasi error ketika gagal mengambil detail unit', async () => {
    getUnitByIdExecuteMock.mockRejectedValue(new Error('Not found'));

    renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'error',
          title: 'Gagal mengambil data',
          description: 'Data unit tidak ditemukan',
        })
      );
    });
  });

  it('menampilkan notifikasi error ketika field wajib kosong saat submit', async () => {
    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(updateUnitExecuteMock).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Unit tidak diupdate',
        description:
          'Nama Unit, Departemen, dan No. SK/Memo wajib diisi',
      })
    );
  });

  it('memanggil API update dan callback ketika submit berhasil', async () => {
    const file = new File(['dummy'], 'memo.pdf', { type: 'application/pdf' });
    setSkFile({ file, name: 'memo.pdf' });

    updateUnitExecuteMock.mockResolvedValue({});
    getUnitsExecuteMock.mockResolvedValue({});

    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    act(() => {
      result.current.setName('Unit A');
      result.current.setDepartmentId('dept-1');
      result.current.setMemoNumber('MEMO-001');
      result.current.setDescription('Deskripsi');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(updateUnitExecuteMock).toHaveBeenCalledTimes(1);
    const [calledId, payload] = updateUnitExecuteMock.mock.calls[0];
    expect(calledId).toBe('unit-1');
    expect(payload.name).toBe('Unit A');
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
        description: 'Unit berhasil diupdate',
      })
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('mengirim skFile null ketika tidak ada file yang dipilih', async () => {
    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    act(() => {
      result.current.setName('Unit A');
      result.current.setDepartmentId('dept-1');
      result.current.setMemoNumber('MEMO-001');
      result.current.setDescription('Deskripsi');
    });

    updateUnitExecuteMock.mockResolvedValue({});
    getUnitsExecuteMock.mockResolvedValue({});

    await act(async () => {
      await result.current.handleSubmit();
    });

    const [, payload] = updateUnitExecuteMock.mock.calls[0];
    expect(payload.skFile).toBeNull();
  });

  it('mengubah file di store ketika handleFileChange dipanggil', () => {
    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: false, onClose, unit, onSuccess })
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
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await act(async () => {
      result.current.handleSearchDepartments('it');
    });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(getDropdownMock).toHaveBeenCalledWith('it');
    expect(result.current.departments).toEqual([
      { value: '1', label: 'IT' },
      { value: '2', label: 'HR' },
    ]);
  });

  it('mereset file ketika tidak ada url file dari API', async () => {
    const apiResponse = {
      data: {
        unit_name: 'Unit A',
        description: 'Deskripsi',
        unit_decree_number: 'MEMO-001',
        unit_decree_file_url: null,
        department_id: 'dept-1',
      },
    };

    getUnitByIdExecuteMock.mockResolvedValue(apiResponse);

    const { result } = renderHook(() =>
      useEditUnitModal({ isOpen: true, onClose, unit, onSuccess })
    );

    await waitFor(() => {
      expect(getUnitByIdExecuteMock).toHaveBeenCalledWith('unit-1');
      expect(result.current.name).toBe('Unit A');
    });

    expect(clearSkFileMock).toHaveBeenCalledTimes(1);
    expect(getSkFile()).toBeNull();
  });
});
