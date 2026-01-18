import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BusinessLinesTab from './BusinessLinesTab';
import { useBusinessLines } from '../../Index';

jest.mock('react-router', () => ({
  __esModule: true,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock('../../../../components/shared/datatable/DataTable', () => ({
  __esModule: true,
  default: ({
    title,
    data,
    actions,
    onAdd,
    onSearchChange,
    onSortChange,
    onPageChangeExternal,
    onRowsPerPageChangeExternal,
  }: any) => (
    <div>
      <h1>{title}</h1>
      <button onClick={onAdd}>tambah</button>
      <button onClick={() => onSearchChange && onSearchChange('cari-lini-bisnis')}>
        trigger-search
      </button>
      <button
        onClick={() => onSortChange && onSortChange('lini-bisnis', 'asc')}
      >
        trigger-sort
      </button>
      <button
        onClick={() => onPageChangeExternal && onPageChangeExternal(2)}
      >
        trigger-page
      </button>
      <button
        onClick={() => onRowsPerPageChangeExternal && onRowsPerPageChangeExternal(25)}
      >
        trigger-rows
      </button>
      {data.map((row: any, index: number) => (
        <div key={index}>
          <span>{row['lini-bisnis']}</span>
          {actions?.map((action: any, actionIndex: number) => (
            <button
              key={actionIndex}
              onClick={() => action.onClick(row)}
            >
              action-{actionIndex}
            </button>
          ))}
        </div>
      ))}
    </div>
  ),
}));

const clearSkFileMock = jest.fn();

jest.mock('@/stores/fileStore', () => ({
  __esModule: true,
  useFileStore: jest.fn(() => ({
    clearSkFile: clearSkFileMock,
  })),
}));

jest.mock('../../components/modals/business-line/AddBusinessLineModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSuccess }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="add-modal">
        <button onClick={onClose}>tutup-add</button>
        <button onClick={onSuccess}>sukses-add</button>
      </div>
    );
  },
}));

jest.mock('../../components/modals/business-line/EditBusinessLineModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSuccess, businessLine }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="edit-modal">
        <span data-testid="edit-modal-name">{businessLine?.name}</span>
        <button onClick={onClose}>tutup-edit</button>
        <button onClick={onSuccess}>sukses-edit</button>
      </div>
    );
  },
}));

jest.mock('../../components/modals/business-line/DeleteBusinessLineModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSuccess, businessLine }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-modal">
        <span data-testid="delete-modal-name">{businessLine?.name}</span>
        <button onClick={onClose}>tutup-delete</button>
        <button onClick={onSuccess}>sukses-delete</button>
      </div>
    );
  },
}));

jest.mock('../../Index', () => ({
  __esModule: true,
  useBusinessLines: jest.fn(),
}));

const mockedUseBusinessLines =
  useBusinessLines as jest.MockedFunction<typeof useBusinessLines>;

describe('BusinessLinesTab', () => {
  const fetchBusinessLines = jest.fn();
  const setSearch = jest.fn();
  const setPage = jest.fn();
  const setPageSize = jest.fn();
  const setSort = jest.fn();
  const getById = jest.fn();

  const setupHookMock = () => {
    getById.mockResolvedValue({
      id: '1',
      name: 'Detail Lini Bisnis',
      description: null,
      memoNumber: 'MEMO-001',
      skFile: null,
    });

    mockedUseBusinessLines.mockReturnValue({
      businessLines: [
        {
          id: '1',
          name: 'Lini Bisnis 1',
          description: 'Deskripsi 1',
          memoNumber: 'MEMO-001',
          skFile: null,
        },
      ],
      fetchBusinessLines,
      loading: false,
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      rows_column: [
        {
          id: '1',
          no: 1,
          'lini-bisnis': 'Lini Bisnis 1',
          'deskripsi-umum': 'Deskripsi 1',
          'file-sk-dan-memo': 'Detail',
        },
      ],
      setSearch,
      setPage,
      setPageSize,
      setSort,
      getById,
      createBusinessLine: jest.fn(),
      updateBusinessLine: jest.fn(),
      deleteBusinessLine: jest.fn(),
      getDetail: jest.fn(),
      getDropdown: jest.fn(),
    } as any);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    clearSkFileMock.mockClear();
    setupHookMock();
  });

  it('merender judul tabel dan baris data dari hook', () => {
    render(<BusinessLinesTab resetKey="reset-1" />);

    expect(
      screen.getByRole('heading', { name: 'Lini Bisnis' })
    ).toBeInTheDocument();
    expect(screen.getByText('Lini Bisnis 1')).toBeInTheDocument();
    expect(screen.getByText('tambah')).toBeInTheDocument();
  });

  it('membuka dan menutup modal tambah ketika tombol tambah diklik', () => {
    render(<BusinessLinesTab resetKey="reset-1" />);

    fireEvent.click(screen.getByText('tambah'));
    expect(screen.getByTestId('add-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('tutup-add'));
    expect(clearSkFileMock).toHaveBeenCalled();
    expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
  });

  it('memanggil getById dan membuka modal edit ketika aksi edit diklik', async () => {
    render(<BusinessLinesTab resetKey="reset-1" />);

    fireEvent.click(screen.getByText('action-0'));

    await waitFor(() => {
      expect(getById).toHaveBeenCalledWith('1');
    });

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByTestId('edit-modal-name')).toHaveTextContent(
      'Detail Lini Bisnis'
    );
  });

  it('membuka modal hapus dengan data business line yang sesuai dan memanggil fetchBusinessLines saat sukses', async () => {
    render(<BusinessLinesTab resetKey="reset-1" />);

    fireEvent.click(screen.getByText('action-1'));

    await waitFor(() => {
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });

    expect(screen.getByTestId('delete-modal-name')).toHaveTextContent(
      'Lini Bisnis 1'
    );

    fireEvent.click(screen.getByText('sukses-delete'));
    expect(fetchBusinessLines).toHaveBeenCalled();
  });

  it('meneruskan event pencarian, sortir, dan paginasi ke hook useBusinessLines', () => {
    render(<BusinessLinesTab resetKey="reset-1" />);

    fireEvent.click(screen.getByText('trigger-search'));
    expect(setSearch).toHaveBeenCalledWith('cari-lini-bisnis');

    fireEvent.click(screen.getByText('trigger-sort'));
    expect(setSort).toHaveBeenCalledWith('lini-bisnis', 'asc');

    fireEvent.click(screen.getByText('trigger-page'));
    expect(setPage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText('trigger-rows'));
    expect(setPageSize).toHaveBeenCalledWith(25);
  });
});
