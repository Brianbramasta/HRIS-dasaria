import { render, screen, fireEvent } from '@testing-library/react';
import EditKompensasiModal from './editCompensationModal';
import { useEditCompensationModal } from '@/features/payroll/hooks/modals/payroll-configuration/compensation/useEditCompensationModal';

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
    readOnly={props.readonly}
    required={props.required}
  />
));

jest.mock('@/components/shared/field/SelectField', () => (props: any) => (
  <select
    data-testid={`select-${props.label}`}
    value={props.defaultValue}
    onChange={(e) => props.onChange(e.target.value)}
    required={props.required}
  >
    {props.options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
));

jest.mock('@/features/payroll/hooks/modals/payroll-configuration/compensation/useEditCompensationModal');

const mockUseEditCompensationModal = useEditCompensationModal as jest.Mock;

describe('EditKompensasiModal Component', () => {
  const mockHandleSubmit = jest.fn();
  const mockHandleInput = jest.fn();
  const mockSetNominal = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultHookReturn = {
    title: 'Edit Kompensasi',
    form: {},
    handleInput: mockHandleInput,
    setNominal: mockSetNominal,
    KATEGORI_OPTIONS: [{ value: 'Gaji Pokok', label: 'Gaji Pokok' }],
    LEVEL_JABATAN_OPTIONS: [],
    handleSubmit: mockHandleSubmit,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEditCompensationModal.mockReturnValue(defaultHookReturn);
  });

  it('harus merender modal ketika isOpen true', () => {
    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Kompensasi')).toBeInTheDocument();
  });

  it('tidak harus merender modal ketika isOpen false', () => {
    render(<EditKompensasiModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('harus menampilkan input field yang benar', () => {
    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('input-Level Jabatan')).toBeInTheDocument();
    expect(screen.getByTestId('input-Jabatan Struktural')).toBeInTheDocument();
    expect(screen.getByTestId('select-Kategori')).toBeInTheDocument();
    expect(screen.getByTestId('input-Nominal General')).toBeInTheDocument();
    expect(screen.getByTestId('input-Nominal Junior')).toBeInTheDocument();
    expect(screen.getByTestId('input-Nominal Middle')).toBeInTheDocument();
    expect(screen.getByTestId('input-Nominal Senior')).toBeInTheDocument();
  });

  it('harus memanggil handleInput saat field kategori berubah', () => {
    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByTestId('select-Kategori'), { target: { value: 'Gaji Pokok' } });
    expect(mockHandleInput).toHaveBeenCalledWith('kategori', 'Gaji Pokok');
  });

  it('harus memanggil setNominal saat input nominal berubah', () => {
    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByTestId('input-Nominal General'), { target: { value: '1000' } });
    expect(mockSetNominal).toHaveBeenCalledWith('general', '1000');
  });

  it('harus menonaktifkan input Junior/Middle/Senior jika General terisi', () => {
    mockUseEditCompensationModal.mockReturnValue({
      ...defaultHookReturn,
      form: { general: '1000' },
    });

    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('input-Nominal Junior')).toBeDisabled();
    expect(screen.getByTestId('input-Nominal Middle')).toBeDisabled();
    expect(screen.getByTestId('input-Nominal Senior')).toBeDisabled();
    expect(screen.getByTestId('input-Nominal General')).not.toBeDisabled();
  });

  it('harus menonaktifkan input General jika salah satu level terisi', () => {
    mockUseEditCompensationModal.mockReturnValue({
      ...defaultHookReturn,
      form: { junior: '1000' },
    });

    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('input-Nominal General')).toBeDisabled();
    expect(screen.getByTestId('input-Nominal Junior')).not.toBeDisabled();
  });

  it('harus memvalidasi field yang required sesuai kondisi', () => {
    // 1. Kondisi awal (semua nominal kosong)
    mockUseEditCompensationModal.mockReturnValue({
      ...defaultHookReturn,
      form: {},
    });
    const { rerender } = render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // Static required fields
    expect(screen.getByTestId('input-Level Jabatan')).toBeRequired();
    expect(screen.getByTestId('input-Jabatan Struktural')).toBeRequired();
    expect(screen.getByTestId('select-Kategori')).toBeRequired();
    
    // Logic eksklusif: jika kosong semua, maka kedua sisi required (karena validasi menuntut salah satu diisi)
    expect(screen.getByTestId('input-Nominal General')).toBeRequired();
    expect(screen.getByTestId('input-Nominal Junior')).toBeRequired();

    // 2. Kondisi General terisi
    mockUseEditCompensationModal.mockReturnValue({
      ...defaultHookReturn,
      form: { general: '1000' },
    });
    rerender(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // Nominal Junior tidak required karena General sudah ada
    expect(screen.getByTestId('input-Nominal Junior')).not.toBeRequired();
    // General tetap required karena Level belum ada
    expect(screen.getByTestId('input-Nominal General')).toBeRequired();

    // 3. Kondisi Level terisi
    mockUseEditCompensationModal.mockReturnValue({
      ...defaultHookReturn,
      form: { junior: '1000' },
    });
    rerender(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // Nominal General tidak required karena Level sudah ada
    expect(screen.getByTestId('input-Nominal General')).not.toBeRequired();
    // Junior tetap required karena General belum ada
    expect(screen.getByTestId('input-Nominal Junior')).toBeRequired();
  });

  it('harus disable tombol simpan saat loading (submitting)', () => {
    render(<EditKompensasiModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} submitting={true} />);
    
    // Verifikasi tombol simpan disabled
    expect(screen.getByText('Simpan Perubahan')).toBeDisabled();
  });
});
