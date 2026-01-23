import { render, screen, fireEvent } from '@testing-library/react';
import EditBpjsModal from './editBpjsModal';
import { useEditBpjsModal } from '@/features/payroll/hooks/modals/payroll-configuration/bpjs/useEditBpjsModal';

// Mock api service to prevent import.meta error
jest.mock('@/services/api', () => ({
  apiService: {},
}));

// Mock hook with factory to avoid parsing original file
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/bpjs/useEditBpjsModal', () => ({
  useEditBpjsModal: jest.fn(),
}));

// Mock child components to isolate test
jest.mock('@/components/shared/modal/ModalAddEdit', () => (props: any) => (
  props.isOpen ? (
    <div role="dialog">
      <h1>{props.title}</h1>
      <div>{props.content}</div>
      <button onClick={props.handleSubmit}>Simpan Perubahan</button>
      <button onClick={props.onClose}>Tutup</button>
    </div>
  ) : null
));

jest.mock('@/components/shared/field/InputField', () => (props: any) => (
  <div data-testid="input-field">
    <label>{props.label}</label>
    <input
      data-testid={`input-${props.label.replace(/\s/g, '-')}`}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      type={props.type}
    />
  </div>
));

describe('EditBpjsModal', () => {
  const mockHandleSubmit = jest.fn();
  const mockSetField = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockForm = {
    detailBpjs: 'BPJS Kesehatan',
    kategoriBpjs: 'Kesehatan',
    jenis: 'Potongan',
    percent: '4',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditBpjsModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
      loading: false,
    });
  });

  it('seharusnya tidak menampilkan apa-apa saat tidak terbuka', () => {
    render(
      <EditBpjsModal
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('seharusnya menampilkan dengan benar saat terbuka', () => {
    render(
      <EditBpjsModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit BPJS')).toBeInTheDocument();
    
    // Check fields
    expect(screen.getByDisplayValue('BPJS Kesehatan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Kesehatan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Potongan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });

  it('seharusnya menangani perubahan input untuk persen', () => {
    render(
      <EditBpjsModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const percentInput = screen.getByTestId('input-%Value');
    fireEvent.change(percentInput, { target: { value: '5' } });

    expect(mockSetField).toHaveBeenCalledWith('percent', '5');
  });

  it('seharusnya mengirim form saat tombol simpan diklik', () => {
    render(
      <EditBpjsModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Simpan Perubahan'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('seharusnya memverifikasi field yang dinonaktifkan', () => {
    render(
      <EditBpjsModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByTestId('input-Detail-BPJS')).toBeDisabled();
    expect(screen.getByTestId('input-Kategori-BPJS')).toBeDisabled();
    expect(screen.getByTestId('input-Jenis')).toBeDisabled();
    expect(screen.getByTestId('input-%Value')).not.toBeDisabled();
  });
});
