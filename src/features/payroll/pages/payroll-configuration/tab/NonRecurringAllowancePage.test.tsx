import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NonRecurringAllowancePage from './NonRecurringAllowancePage';
import { useNonFixedAllowance } from '@/features/payroll/hooks/modals/payroll-configuration/non-fixed-allowance/useNonFixedAllowance';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/non-fixed-allowance/useNonFixedAllowance');

// Mock child components
jest.mock('@/components/shared/datatable/DataTable', () => {
  return function MockDataTable(props: any) {
    return (
      <div data-testid="data-table">
        <div data-testid="table-title">{props.title}</div>
        <button onClick={props.onAdd} data-testid="btn-add">
          {props.addButtonLabel}
        </button>
        <input
          data-testid="search-input"
          onChange={(e) => props.onSearchChange(e.target.value)}
        />
        {props.data.map((row: any) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span>{row['Nama Tunjangan']}</span>
            {props.actions.map((action: any, index: number) => (
              <button
                key={index}
                data-testid={`action-${index}-${row.id}`}
                onClick={() => action.onClick(row)}
              >
                Action {index}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/features/payroll/components/modals/payroll-configuration/non-recurring-allowance/EditNonRecurringAllowanceModal', () => {
  return function MockEditModal(props: any) {
    return props.isOpen ? (
      <div data-testid="edit-modal">
        <span>{props.title}</span>
        <button onClick={() => props.onSave({ namaTunjangan: 'New', kategori: 'Cat', deskripsiUmum: 'Desc' })}>
          Save
        </button>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock('@/features/payroll/components/modals/payroll-configuration/non-recurring-allowance/EditNonRecurringAllowanceModalDelete', () => {
  return function MockDeleteModal(props: any) {
    return props.isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={props.onDelete}>Confirm Delete</button>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('Halaman NonRecurringAllowancePage', () => {
  const mockCreateData = jest.fn();
  const mockUpdateData = jest.fn();
  const mockDeleteData = jest.fn();
  const mockHandleSuccess = jest.fn();
  const mockHandleAddOpen = jest.fn();
  const mockHandleEditOpen = jest.fn();
  const mockHandleDeleteOpen = jest.fn();
  const mockHandleClose = jest.fn();
  const mockSetSearch = jest.fn();

  const defaultMockValues = {
    rows: [
      { id: '1', 'Nama Tunjangan': 'Makan', 'Sub Kategori': 'Harian', 'Deksripsi Umum': 'Uang makan', raw: { id: '1', allowanceName: 'Makan', categorySub: 'Harian', description: 'Uang makan' } },
      { id: '2', 'Nama Tunjangan': 'Transport', 'Sub Kategori': 'Harian', 'Deksripsi Umum': 'Uang bensin', raw: { id: '2', allowanceName: 'Transport', categorySub: 'Harian', description: 'Uang bensin' } },
    ],
    loading: false,
    total: 2,
    page: 1,
    pageSize: 10,
    setSearch: mockSetSearch,
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSort: jest.fn(),
    addModal: { isOpen: false },
    editModal: { isOpen: false },
    deleteModal: { isOpen: false },
    selected: null,
    handleAddOpen: mockHandleAddOpen,
    handleEditOpen: mockHandleEditOpen,
    handleDeleteOpen: mockHandleDeleteOpen,
    handleClose: mockHandleClose,
    handleSuccess: mockHandleSuccess,
    createData: mockCreateData,
    updateData: mockUpdateData,
    deleteData: mockDeleteData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNonFixedAllowance as jest.Mock).mockReturnValue(defaultMockValues);
  });

  it('seharusnya merender judul tabel dan data dengan benar', () => {
    render(<NonRecurringAllowancePage />);
    
    expect(screen.getByTestId('table-title')).toHaveTextContent('Tunjangan Tidak Tetap');
    expect(screen.getByText('Makan')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('seharusnya memanggil handleAddOpen saat tombol tambah diklik', () => {
    render(<NonRecurringAllowancePage />);
    
    fireEvent.click(screen.getByTestId('btn-add'));
    expect(mockHandleAddOpen).toHaveBeenCalled();
  });

  it('seharusnya memanggil handleEditOpen saat tombol edit diklik', () => {
    render(<NonRecurringAllowancePage />);
    
    // Index 1 is Edit (IconPencil) based on Page definition
    fireEvent.click(screen.getByTestId('action-1-1'));
    expect(mockHandleEditOpen).toHaveBeenCalledWith(defaultMockValues.rows[0].raw);
  });

  it('seharusnya memanggil handleDeleteOpen saat tombol hapus diklik', () => {
    render(<NonRecurringAllowancePage />);
    
    // Index 0 is Delete (IconHapus) based on Page definition
    fireEvent.click(screen.getByTestId('action-0-1'));
    expect(mockHandleDeleteOpen).toHaveBeenCalledWith(defaultMockValues.rows[0].raw);
  });

  it('seharusnya merender modal tambah/edit saat isOpen true', () => {
    (useNonFixedAllowance as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      addModal: { isOpen: true },
    });

    render(<NonRecurringAllowancePage />);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Tambah Tunjangan Tidak Tetap')).toBeInTheDocument();
  });

  it('seharusnya memanggil createData saat menyimpan data baru', async () => {
    (useNonFixedAllowance as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      addModal: { isOpen: true },
      selected: null, // Mode tambah
    });

    render(<NonRecurringAllowancePage />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
        expect(mockCreateData).toHaveBeenCalledWith({
            allowanceName: 'New',
            categorySub: 'Cat',
            description: 'Desc'
        });
        expect(mockHandleSuccess).toHaveBeenCalled();
    });
  });

  it('seharusnya memanggil updateData saat menyimpan perubahan data', async () => {
    const selectedItem = { id: '1', allowanceName: 'Old', categorySub: 'OldCat', description: 'OldDesc' };
    (useNonFixedAllowance as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      editModal: { isOpen: true },
      selected: selectedItem, // Mode edit
    });

    render(<NonRecurringAllowancePage />);
    
    expect(screen.getByText('Edit Tunjangan Tidak Tetap')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
        expect(mockUpdateData).toHaveBeenCalledWith('1', {
            allowanceName: 'New',
            categorySub: 'Cat',
            description: 'Desc'
        });
        expect(mockHandleSuccess).toHaveBeenCalled();
    });
  });

  it('seharusnya merender modal hapus saat deleteModal isOpen true', () => {
    (useNonFixedAllowance as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      deleteModal: { isOpen: true },
      selected: { id: '1', allowanceName: 'Makan' },
    });

    render(<NonRecurringAllowancePage />);
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('seharusnya memanggil deleteData saat konfirmasi hapus', async () => {
    (useNonFixedAllowance as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      deleteModal: { isOpen: true },
      selected: { id: '1', allowanceName: 'Makan' },
      deleteData: mockDeleteData.mockResolvedValue(true), // Mock return true
    });

    render(<NonRecurringAllowancePage />);
    
    fireEvent.click(screen.getByText('Confirm Delete'));
    
    await waitFor(() => {
        expect(mockDeleteData).toHaveBeenCalledWith('1');
        expect(mockHandleSuccess).toHaveBeenCalled();
    });
  });

  it('seharusnya memanggil setSearch saat input pencarian berubah', () => {
    render(<NonRecurringAllowancePage />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    expect(mockSetSearch).toHaveBeenCalledWith('Test');
  });
});
