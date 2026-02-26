import { render, screen, fireEvent } from '@testing-library/react';
import AcuanPotonganPage from './DeductionReferencePage';
import { useRefDeduction } from '@/features/payroll/hooks/payroll-configuration/deduction-reference/useRefDeduction';

// Mock api service globally to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    buildQueryString: jest.fn(),
  },
}));

// Mock dependencies
jest.mock('@/components/shared/datatable/DataTable', () => ({
  DataTable: (props: any) => (
    <div data-testid="datatable">
      <h1>{props.title}</h1>
      <button onClick={() => props.onSearchChange('test')}>Search</button>
      <button onClick={() => props.onSortChange('col', 'asc')}>Sort</button>
      <button onClick={() => props.onPageChangeExternal(2)}>Page</button>
      <button onClick={() => props.onRowsPerPageChangeExternal(20)}>Rows</button>
      <button onClick={props.onExport}>Export</button>
      <ul>
        {props.data.map((row: any) => (
          <li key={row.id}>
            {row.acuanPotongan}
            <button onClick={() => props.actions[0].onClick(row)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

jest.mock('@/features/payroll/components/modals/payroll-configuration/deduction-reference/EditDeductionReferenceModal', () => (props: any) => (
  props.isOpen ? <div data-testid="edit-modal">Edit Modal Open</div> : null
));

jest.mock('@/features/payroll/hooks/payroll-configuration/deduction-reference/useRefDeduction');
jest.mock('@/icons/components/icons', () => ({
  IconPencil: () => <span>EditIcon</span>,
}));

const mockUseRefDeduction = useRefDeduction as jest.Mock;

describe('AcuanPotonganPage Component', () => {
  const mockHookReturn = {
    rows: [{ id: '1', acuanPotongan: 'UMR', raw: { id: '1' } }],
    loading: false,
    total: 10,
    page: 1,
    pageSize: 10,
    setSearch: jest.fn(),
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSort: jest.fn(),
    editModal: { isOpen: false },
    selected: null,
    handleEditOpen: jest.fn(),
    handleClose: jest.fn(),
    handleSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRefDeduction.mockReturnValue(mockHookReturn);
  });

  it('harus merender halaman acuan potongan dan datatable', () => {
    render(<AcuanPotonganPage />);
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.getByText('Acuan Potongan')).toBeInTheDocument();
  });

  it('harus menampilkan data di tabel', () => {
    render(<AcuanPotonganPage />);
    expect(screen.getByText('UMR')).toBeInTheDocument();
  });

  it('harus memanggil handleEditOpen saat tombol edit diklik', () => {
    render(<AcuanPotonganPage />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockHookReturn.handleEditOpen).toHaveBeenCalledWith({ id: '1' });
  });

  it('harus merender modal edit saat isOpen true', () => {
    mockUseRefDeduction.mockReturnValue({
      ...mockHookReturn,
      editModal: { isOpen: true },
    });
    render(<AcuanPotonganPage />);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('harus memanggil setSearch saat pencarian dilakukan', () => {
    render(<AcuanPotonganPage />);
    fireEvent.click(screen.getByText('Search'));
    expect(mockHookReturn.setSearch).toHaveBeenCalledWith('test');
  });

  it('harus memanggil setPage saat halaman berubah', () => {
    render(<AcuanPotonganPage />);
    fireEvent.click(screen.getByText('Page'));
    expect(mockHookReturn.setPage).toHaveBeenCalledWith(2);
  });
});
