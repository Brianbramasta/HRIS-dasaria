import { render, screen, fireEvent } from '@testing-library/react';
import KompensasiPage from './CompensationPage';
import { useCompensation } from '@/features/payroll/hooks/payroll-configuration/compensation/useCompensation';

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
            {row['level-jabatan']}
            <button onClick={() => props.actions[0].onClick(row)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

jest.mock('@/features/payroll/components/modals/payroll-configuration/compensation/editCompensationModal', () => (props: any) => (
  props.isOpen ? <div data-testid="edit-modal">Edit Modal Open</div> : null
));

jest.mock('@/features/payroll/hooks/payroll-configuration/compensation/useCompensation');
jest.mock('@/icons/components/icons', () => ({
  IconPencil: () => <span>EditIcon</span>,
}));

const mockUseCompensation = useCompensation as jest.Mock;

describe('KompensasiPage Component', () => {
  const mockHookReturn = {
    rows: [{ id: '1', 'level-jabatan': 'Manager', raw: { id: '1' } }],
    loading: false,
    total: 10,
    page: 1,
    pageSize: 10,
    setSearch: jest.fn(),
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSort: jest.fn(),
    editModal: { isOpen: false },
    initialFormData: null,
    handleEditOpen: jest.fn(),
    handleEditClose: jest.fn(),
    handleEditSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCompensation.mockReturnValue(mockHookReturn);
  });

  it('harus merender halaman kompensasi dan datatable', () => {
    render(<KompensasiPage />);
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.getByText('Kompensasi')).toBeInTheDocument();
  });

  it('harus menampilkan data di tabel', () => {
    render(<KompensasiPage />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('harus memanggil handleEditOpen saat tombol edit diklik', () => {
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockHookReturn.handleEditOpen).toHaveBeenCalledWith({ id: '1' });
  });

  it('harus merender modal edit saat isOpen true', () => {
    mockUseCompensation.mockReturnValue({
      ...mockHookReturn,
      editModal: { isOpen: true },
    });
    render(<KompensasiPage />);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('harus memanggil setSearch saat pencarian dilakukan', () => {
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Search'));
    expect(mockHookReturn.setSearch).toHaveBeenCalledWith('test');
  });

  it('harus memanggil setPage saat halaman berubah', () => {
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Page'));
    expect(mockHookReturn.setPage).toHaveBeenCalledWith(2);
  });

  it('harus memanggil setPageSize saat jumlah baris per halaman berubah', () => {
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Rows'));
    expect(mockHookReturn.setPageSize).toHaveBeenCalledWith(20);
  });

  it('harus memanggil setSort saat kolom diurutkan', () => {
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Sort'));
    expect(mockHookReturn.setSort).toHaveBeenCalledWith('col', 'asc');
  });

  it('harus memanggil fungsi export saat tombol export diklik', () => {
    // Mock URL.createObjectURL and generic document methods since they are used in exportCSV
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    
    render(<KompensasiPage />);
    fireEvent.click(screen.getByText('Export'));
    
    // Since exportCSV is internal to the component and not exposed via hook, 
    // we verify it doesn't crash. Real verification would require checking DOM manipulation 
    // or mocking Blob/URL which we did partially.
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
