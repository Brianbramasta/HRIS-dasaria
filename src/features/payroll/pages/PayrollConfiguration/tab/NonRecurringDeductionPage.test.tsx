import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NonRecurringDeductionPage from './NonRecurringDeductionPage';
import { useNonRecurringDeduction } from '@/features/payroll/hooks/payroll-configuration/non-recurring-deduction/useNonRecurringDeduction';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/payroll-configuration/non-recurring-deduction/useNonRecurringDeduction');

// Mock child components
jest.mock('@/components/shared/datatable/DataTable', () => {
  return function MockDataTable(props: any) {
    return (
      <div data-testid="data-table">
        <div data-testid="table-title">{props.title}</div>
        <button onClick={props.onAdd} data-testid="btn-add">
          {props.addButtonLabel}
        </button>
        <button onClick={props.onExport} data-testid="btn-export">
            Export
        </button>
        <input
          data-testid="search-input"
          onChange={(e) => props.onSearchChange(e.target.value)}
        />
        {props.data.map((row: any) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span>{row.deductionName}</span>
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

jest.mock('@/features/payroll/components/modals/payroll-configuration/non-recurring-deduction/NonRecurringDeductionModal', () => {
  return function MockModal(props: any) {
    return props.isOpen ? (
      <div data-testid="form-modal">
        <span>{props.title}</span>
        <button onClick={() => props.onSave({ deductionName: 'New', category: 'Cat', description: 'Desc' })}>
          Save
        </button>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock('@/features/payroll/components/modals/payroll-configuration/non-recurring-deduction/NonRecurringDeductionModalDelete', () => {
  return function MockDeleteModal(props: any) {
    return props.isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={props.onDelete}>Confirm Delete</button>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null;
  };
});

// Mock URL methods for Export CSV
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('Halaman NonRecurringDeductionPage', () => {
  const mockHandleSave = jest.fn();
  const mockOnDeleteConfirm = jest.fn();
  const mockHandleAddOpen = jest.fn();
  const mockHandleEditOpen = jest.fn();
  const mockHandleDelete = jest.fn();
  const mockSetSearch = jest.fn();
  
  // Mock addModal object structure correctly
  const mockAddModal = {
    isOpen: false,
    closeModal: jest.fn(),
    openModal: jest.fn()
  };
  
  const mockEditModal = {
    isOpen: false,
    closeModal: jest.fn(),
    openModal: jest.fn()
  };

  const mockDeleteModal = {
    isOpen: false,
    closeModal: jest.fn(),
    openModal: jest.fn()
  };

  const defaultMockValues = {
    rows: [
      { id: '1', no: 1, deductionName: 'Telat', category: 'Absensi', description: 'Potongan telat' },
      { id: '2', no: 2, deductionName: 'Kasbon', category: 'Pinjaman', description: 'Bayar hutang' },
    ],
    loading: false,
    total: 2,
    page: 1,
    pageSize: 10,
    setSearch: mockSetSearch,
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSort: jest.fn(),
    addModal: mockAddModal,
    editModal: mockEditModal,
    deleteModal: mockDeleteModal,
    detailValues: null,
    selectedName: '',
    handleAddOpen: mockHandleAddOpen,
    handleEditOpen: mockHandleEditOpen,
    handleDelete: mockHandleDelete,
    onDeleteConfirm: mockOnDeleteConfirm,
    handleSave: mockHandleSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNonRecurringDeduction as jest.Mock).mockReturnValue(defaultMockValues);
  });

  it('seharusnya merender judul tabel dan data dengan benar', () => {
    render(<NonRecurringDeductionPage />);
    
    expect(screen.getByTestId('table-title')).toHaveTextContent('Potongan Tidak Tetap');
    expect(screen.getByText('Telat')).toBeInTheDocument();
    expect(screen.getByText('Kasbon')).toBeInTheDocument();
  });

  it('seharusnya memanggil handleAddOpen saat tombol tambah diklik', () => {
    render(<NonRecurringDeductionPage />);
    
    fireEvent.click(screen.getByTestId('btn-add'));
    expect(mockHandleAddOpen).toHaveBeenCalled();
  });

  it('seharusnya memanggil handleEditOpen saat tombol edit diklik', () => {
    render(<NonRecurringDeductionPage />);
    
    // Index 1 is Edit (IconPencil)
    fireEvent.click(screen.getByTestId('action-1-1'));
    expect(mockHandleEditOpen).toHaveBeenCalledWith('1');
  });

  it('seharusnya memanggil handleDelete saat tombol hapus diklik', () => {
    render(<NonRecurringDeductionPage />);
    
    // Index 0 is Delete (IconHapus)
    fireEvent.click(screen.getByTestId('action-0-1'));
    expect(mockHandleDelete).toHaveBeenCalledWith('1', 'Telat');
  });

  it('seharusnya merender modal tambah saat addModal isOpen true', () => {
    (useNonRecurringDeduction as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      addModal: { ...mockAddModal, isOpen: true },
    });

    render(<NonRecurringDeductionPage />);
    expect(screen.getByTestId('form-modal')).toBeInTheDocument();
    expect(screen.getByText('Tambah Potongan Tidak Tetap')).toBeInTheDocument();
  });

  it('seharusnya merender modal edit saat editModal isOpen true', () => {
    (useNonRecurringDeduction as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      editModal: { ...mockEditModal, isOpen: true },
      detailValues: { deductionName: 'Old' },
    });

    render(<NonRecurringDeductionPage />);
    expect(screen.getByTestId('form-modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Potongan Tidak Tetap')).toBeInTheDocument();
  });

  it('seharusnya memanggil handleSave saat form modal disimpan', () => {
    (useNonRecurringDeduction as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      addModal: { ...mockAddModal, isOpen: true },
    });

    render(<NonRecurringDeductionPage />);
    
    fireEvent.click(screen.getByText('Save'));
    expect(mockHandleSave).toHaveBeenCalledWith({
      deductionName: 'New',
      category: 'Cat',
      description: 'Desc'
    });
  });

  it('seharusnya merender modal hapus saat deleteModal isOpen true', () => {
    (useNonRecurringDeduction as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      deleteModal: { ...mockDeleteModal, isOpen: true },
      selectedName: 'Telat',
    });

    render(<NonRecurringDeductionPage />);
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('seharusnya memanggil onDeleteConfirm saat konfirmasi hapus', () => {
    (useNonRecurringDeduction as jest.Mock).mockReturnValue({
      ...defaultMockValues,
      deleteModal: { ...mockDeleteModal, isOpen: true },
    });

    render(<NonRecurringDeductionPage />);
    
    fireEvent.click(screen.getByText('Confirm Delete'));
    expect(mockOnDeleteConfirm).toHaveBeenCalled();
  });

  it('seharusnya memanggil setSearch saat input pencarian berubah', () => {
    render(<NonRecurringDeductionPage />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    expect(mockSetSearch).toHaveBeenCalledWith('Test');
  });

  it('seharusnya mengekspor CSV saat tombol export diklik', () => {
    render(<NonRecurringDeductionPage />);
    
    // Mock Blob and URL
    const mockClick = jest.fn();
    const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
        return {
            click: mockClick,
            setAttribute: jest.fn(),
            href: '',
        } as any;
    });
    
    const mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    fireEvent.click(screen.getByTestId('btn-export'));

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    
    mockCreateElement.mockRestore();
    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });
});
