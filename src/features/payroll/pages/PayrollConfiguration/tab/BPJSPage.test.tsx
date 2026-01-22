import { render, screen, fireEvent } from '@testing-library/react';
import BPJSPage from './BPJSPage';
import { useBpjsPage } from '@/features/payroll/hooks/payroll-configuration/bpjs/useBpjsPage';

// Mock api service to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {},
}));

// Mock hook
jest.mock('@/features/payroll/hooks/payroll-configuration/bpjs/useBpjsPage');

// Mock child components
jest.mock('@/components/shared/datatable/DataTable', () => ({
  DataTable: ({ title, data, actions, onExport }: any) => (
    <div data-testid="data-table">
      <h1>{title}</h1>
      <ul>
        {data.map((row: any, i: number) => (
          <li key={i}>
            {row.detailBpjs}
            {actions.map((action: any, idx: number) => (
              <button
                key={idx}
                onClick={() => action.onClick(row)}
                data-testid={`action-${i}`}
              >
                {action.icon ? 'Icon' : 'Action'}
              </button>
            ))}
          </li>
        ))}
      </ul>
      <button onClick={onExport}>Export</button>
    </div>
  ),
}));

jest.mock('@/features/payroll/components/modals/payroll-configuration/bpjs/editBpjsModal', () => (props: any) => (
  props.isOpen ? <div data-testid="edit-modal">Edit Modal Open</div> : <div data-testid="edit-modal-closed">Edit Modal Closed</div>
));

// Mock Icon
jest.mock('@/icons/components/icons', () => ({
  IconPencil: () => <span>Pencil</span>,
}));

describe('BPJSPage', () => {
  const mockHandleEditOpen = jest.fn();
  const mockHandleClose = jest.fn();
  const mockHandleSuccess = jest.fn();
  const mockSetSearch = jest.fn();
  const mockSetPage = jest.fn();

  const mockRows = [
    {
      no: 1,
      detailBpjs: 'BPJS Test',
      kategoriBpjs: 'Category',
      jenis: 'Type',
      percent: '1%',
      original: { id: '1', name: 'BPJS Test' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useBpjsPage as jest.Mock).mockReturnValue({
      rows: mockRows,
      loading: false,
      total: 1,
      page: 1,
      setSearch: mockSetSearch,
      setPage: mockSetPage,
      setPageSize: jest.fn(),
      setSort: jest.fn(),
      editModal: { isOpen: false },
      selected: null,
      handleEditOpen: mockHandleEditOpen,
      handleClose: mockHandleClose,
      handleSuccess: mockHandleSuccess,
    });
  });

  it('seharusnya merender DataTable dengan data yang benar', () => {
    render(<BPJSPage />);
    
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByText('BPJS')).toBeInTheDocument();
    expect(screen.getByText('BPJS Test')).toBeInTheDocument();
  });

  it('seharusnya memicu aksi edit', () => {
    render(<BPJSPage />);
    
    const editButton = screen.getByTestId('action-0');
    fireEvent.click(editButton);
    
    expect(mockHandleEditOpen).toHaveBeenCalledWith(mockRows[0].original);
  });

  it('seharusnya merender EditBpjsModal', () => {
    // Test when closed
    const { rerender } = render(<BPJSPage />);
    expect(screen.getByTestId('edit-modal-closed')).toBeInTheDocument();

    // Test when open
    (useBpjsPage as jest.Mock).mockReturnValue({
        ...useBpjsPage(),
        editModal: { isOpen: true },
        selected: mockRows[0].original,
    });

    rerender(<BPJSPage />);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('seharusnya menangani export', () => {
    // Mock URL.createObjectURL
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    render(<BPJSPage />);
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    expect(mockCreateObjectURL).toHaveBeenCalled();
  });
});
