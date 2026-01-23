import { render, screen, fireEvent } from '@testing-library/react';
import EditAcuanPotonganModal from './EditDeductionReferenceModal';
import { useEditDeductionReferenceModal } from '@/features/payroll/hooks/modals/payroll-configuration/deduction-reference/useEditDeductionReferenceModal';

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
jest.mock('@/components/shared/modal/ModalAddEdit', () => (props: any) => (
  props.isOpen ? (
    <div data-testid="modal">
      <h1>{props.title}</h1>
      {props.content}
      <button onClick={props.handleSubmit} disabled={props.submitting}>Simpan Perubahan</button>
      <button onClick={props.onClose}>Tutup</button>
    </div>
  ) : null
));

jest.mock('@/components/shared/field/InputField', () => (props: any) => (
  <input
    data-testid={`input-${props.label}`}
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
    disabled={props.disabled}
  />
));

jest.mock('@/components/shared/field/SelectField', () => (props: any) => (
  <select
    data-testid={`select-${props.label}`}
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    disabled={props.disabled}
  >
    {props.options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
));

jest.mock('@/components/shared/field/TextAreaField', () => (props: any) => (
  <textarea
    data-testid={`textarea-${props.label}`}
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  />
));

jest.mock('@/features/payroll/hooks/modals/payroll-configuration/deduction-reference/useEditDeductionReferenceModal');

const mockUseEditDeductionReferenceModal = useEditDeductionReferenceModal as jest.Mock;

describe('EditAcuanPotonganModal Component', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const defaultHookReturn = {
    form: {
      acuanPotongan: 'UMR',
      kategori: 'BPJS',
      nominal: '1.000.000',
      keterangan: 'Desc',
    },
    setField: mockSetField,
    kategoriOptions: [{ value: 'BPJS', label: 'BPJS' }],
    handleSubmit: mockHandleSubmit,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEditDeductionReferenceModal.mockReturnValue(defaultHookReturn);
  });

  it('harus merender modal ketika isOpen true', () => {
    render(<EditAcuanPotonganModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Acuan Potongan')).toBeInTheDocument();
  });

  it('tidak harus merender modal ketika isOpen false', () => {
    render(<EditAcuanPotonganModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('harus menampilkan field dengan nilai yang benar', () => {
    render(<EditAcuanPotonganModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('input-Acuan Potongan')).toHaveValue('UMR');
    expect(screen.getByTestId('select-Kategori')).toHaveValue('BPJS');
    expect(screen.getByTestId('input-Nominal')).toHaveValue('1.000.000');
    expect(screen.getByTestId('textarea-Keterangan')).toHaveValue('Desc');
  });

  it('field acuan potongan dan kategori harus disabled', () => {
    render(<EditAcuanPotonganModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('input-Acuan Potongan')).toBeDisabled();
    expect(screen.getByTestId('select-Kategori')).toBeDisabled();
  });

  it('harus memanggil setField saat input berubah', () => {
    render(<EditAcuanPotonganModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByTestId('input-Nominal'), { target: { value: '2.000.000' } });
    expect(mockSetField).toHaveBeenCalledWith('nominal', '2.000.000');
  });

  it('harus memanggil handleSubmit saat tombol simpan diklik', () => {
    render(<EditAcuanPotonganModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Simpan Perubahan'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
