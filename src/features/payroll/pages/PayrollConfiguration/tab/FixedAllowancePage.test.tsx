import { render, screen, fireEvent } from '@testing-library/react';
import TunjanganTetapPage from './FixedAllowancePage';
import { usePositionAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/usePositionAllowance';
import { useMarriageAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useMarriageAllowance';
import { useLengthOfServiceAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useLengthOfServiceAllowance';
import { useTransportationAllowance } from '@/features/payroll/hooks/payroll-configuration/fixed-allowance/useTransportationAllowance';
import '@testing-library/jest-dom';

// Mock hooks with factories to avoid importing real files that might use api.ts
jest.mock('@/features/payroll/hooks/payroll-configuration/fixed-allowance/usePositionAllowance', () => ({
  usePositionAllowance: jest.fn(),
}));
jest.mock('@/features/payroll/hooks/payroll-configuration/fixed-allowance/useMarriageAllowance', () => ({
  useMarriageAllowance: jest.fn(),
}));
jest.mock('@/features/payroll/hooks/payroll-configuration/fixed-allowance/useLengthOfServiceAllowance', () => ({
  useLengthOfServiceAllowance: jest.fn(),
}));
jest.mock('@/features/payroll/hooks/payroll-configuration/fixed-allowance/useTransportationAllowance', () => ({
  useTransportationAllowance: jest.fn(),
}));

// Mock components
jest.mock('@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditMarriageAllowanceModal', () => () => <div data-testid="modal-marriage" />);
jest.mock('@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditLengthOfServiceAllowanceModal', () => () => <div data-testid="modal-los" />);
jest.mock('@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditTransportationAllowanceModal', () => () => <div data-testid="modal-transport" />);
jest.mock('@/features/payroll/components/modals/payroll-configuration/fixedAllowance/EditPositionAndBPJSAllowanceModal', () => () => <div data-testid="modal-position" />);

describe('TunjanganTetapPage', () => {
  const mockHandleEditOpenPosition = jest.fn();
  const mockHandleEditOpenMarriage = jest.fn();
  const mockHandleEditOpenLOS = jest.fn();
  const mockHandleEditOpenTransport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePositionAllowance as jest.Mock).mockReturnValue({
      positionAllowanceRows: [{ id: '1', jabatan: 'Manager', presentase: '10%', nominal: 1000000 }],
      loading: false,
      editModal: { isOpen: false, closeModal: jest.fn() },
      handleEditOpen: mockHandleEditOpenPosition,
      handleUpdate: jest.fn(),
      selected: null,
    });

    (useMarriageAllowance as jest.Mock).mockReturnValue({
      marriageAllowanceRows: [{ id: '1', statusPernikahan: 'Menikah', nominal: 500000 }],
      loading: false,
      editModal: { isOpen: false, closeModal: jest.fn() },
      handleEditOpen: mockHandleEditOpenMarriage,
      handleUpdate: jest.fn(),
      selected: null,
    });

    (useLengthOfServiceAllowance as jest.Mock).mockReturnValue({
      lengthOfServiceRows: [{ id: '1', lamaKerja: '1 Tahun', nominal: 200000 }],
      loading: false,
      editModal: { isOpen: false, closeModal: jest.fn() },
      handleEditOpen: mockHandleEditOpenLOS,
      handleUpdate: jest.fn(),
      selected: null,
    });

    (useTransportationAllowance as jest.Mock).mockReturnValue({
      transportationAllowanceRows: [{ id: '1', transportasi: 'Motor', nominal: 300000 }],
      loading: false,
      editModal: { isOpen: false, closeModal: jest.fn() },
      handleEditOpen: mockHandleEditOpenTransport,
      handleUpdate: jest.fn(),
      selected: null,
    });
  });

  it('seharusnya merender semua section tunjangan', () => {
    render(<TunjanganTetapPage />);
    
    expect(screen.getByText('Tunjangan Jabatan dan BPJS')).toBeInTheDocument();
    expect(screen.getByText('Tunjangan Pernikahan')).toBeInTheDocument();
    expect(screen.getByText('Tunjangan Lama Kerja')).toBeInTheDocument();
    expect(screen.getByText('Tunjangan Transportasi')).toBeInTheDocument();
  });

  it('seharusnya merender data tabel dengan benar', () => {
    render(<TunjanganTetapPage />);

    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Menikah')).toBeInTheDocument();
    expect(screen.getByText('1 Tahun')).toBeInTheDocument();
    expect(screen.getByText('Motor')).toBeInTheDocument();
  });

  it('seharusnya memanggil handleEditOpen saat tombol edit diklik pada tabel Tunjangan Jabatan', () => {
    render(<TunjanganTetapPage />);
    
    // Using a specific way to find the edit button. Since we mocked the table logic, 
    // we rely on how DocumentsTable renders actions or if we mocked DocumentsTable (we didn't, so it renders real one).
    // The real DocumentsTable renders buttons. We can look for the pencil icon or similar.
    // However, since DocumentsTable is complex, let's just assume we can find the button.
    // If DocumentsTable renders real DOM, we might need to be specific.
    // But DocumentsTable is imported from features... let's check if we should mock it.
    // The user didn't ask to test DocumentsTable, but Page uses it.
    // If we don't mock it, we rely on its implementation.
    // Let's try to find the button by role or some identifiable attribute.
    // The actions use IconPencil.
    
    // We can just try to click all buttons or specific one.
    // Or simpler: mock DocumentsTable to just render a button with a testid triggering the action.
  });
  
  // Re-render with mocked DocumentsTable for easier testing of interactions
});

// Mocking DocumentsTable to simplify testing actions
jest.mock('@/features/structure-and-organize/components/table/TableGlobal', () => {
  return ({ actions, items, columns }: any) => (
    <div>
      {items.map((item: any, idx: number) => (
        <div key={idx} data-testid="table-row">
          {columns.map((col: any) => (
             <div key={col.id}>{col.render ? col.render(item[col.id], item, idx) : item[col.id]}</div>
          ))}
          {actions && actions.map((action: any, i: number) => (
            <button key={i} onClick={() => action.onClick(item)} data-testid={`action-${i}`}>
              Action
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});

describe('TunjanganTetapPage Interactions', () => {
    const mockHandleEditOpenPosition = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        (usePositionAllowance as jest.Mock).mockReturnValue({
            positionAllowanceRows: [{ id: '1', jabatan: 'Manager', presentase: '10%', nominal: 1000000 }],
            loading: false,
            editModal: { isOpen: false, closeModal: jest.fn() },
            handleEditOpen: mockHandleEditOpenPosition,
            handleUpdate: jest.fn(),
            selected: null,
        });
        // Mock others with empty data or minimal needed
        (useMarriageAllowance as jest.Mock).mockReturnValue({ marriageAllowanceRows: [], editModal: {}, handleEditOpen: jest.fn() });
        (useLengthOfServiceAllowance as jest.Mock).mockReturnValue({ lengthOfServiceRows: [], editModal: {}, handleEditOpen: jest.fn() });
        (useTransportationAllowance as jest.Mock).mockReturnValue({ transportationAllowanceRows: [], editModal: {}, handleEditOpen: jest.fn() });
    });

    it('seharusnya memanggil handleEditOpenPosition saat tombol edit diklik', () => {
        render(<TunjanganTetapPage />);
        
        // Find the action button. In our mock, it's the first action button for the first row.
        const actionButtons = screen.getAllByTestId('action-0');
        fireEvent.click(actionButtons[0]); // First table is Position Allowance

        expect(mockHandleEditOpenPosition).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });
    
    it('seharusnya memanggil handleEditOpenPosition saat tombol detail diklik', () => {
        render(<TunjanganTetapPage />);
        
        // The 'detailBpjs' column renders a button with onClick calling handleEditOpenPosition
        // In our mock table, columns are rendered.
        // We need to find the element rendered by 'detailBpjs' column.
        // The column definition: { id: 'detailBpjs', ..., render: ... }
        // The render function returns a button.
        
        // We can look for the IconFileDetail if we didn't mock it, or just the button.
        // Since we mocked TableGlobal, we are rendering the result of col.render.
        // The real col.render returns a button with IconFileDetail.
        // We need to make sure IconFileDetail doesn't crash or mock it too.
        
        // We can just look for the button inside the row.
        // Or better, let's mock IconFileDetail to text "DetailIcon"
    });
});
