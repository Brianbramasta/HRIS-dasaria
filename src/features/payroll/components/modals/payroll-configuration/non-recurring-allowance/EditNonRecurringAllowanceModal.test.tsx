import { render, screen, fireEvent } from '@testing-library/react';
import EditTunjanganTidakTetapModal from './EditNonRecurringAllowanceModal';
import { useEditNonRecurringAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/non-recurring-allowance/useEditNonRecurringAllowanceModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/non-recurring-allowance/useEditNonRecurringAllowanceModal', () => ({
  useEditNonRecurringAllowanceModal: jest.fn(),
}));

describe('EditTunjanganTidakTetapModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    namaTunjangan: 'Tunjangan Bonus',
    kategori: 'Umum',
    deskripsiUmum: 'Deskripsi Bonus',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditNonRecurringAllowanceModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul default yang benar', () => {
    render(
      <EditTunjanganTidakTetapModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Tunjangan Tidak Tetap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan nama tunjangan')).toHaveValue('Tunjangan Bonus');
    expect(screen.getByPlaceholderText('Tulis description ...')).toHaveValue('Deskripsi Bonus');
  });

  it('seharusnya merender modal dengan judul kustom jika diberikan', () => {
    render(
      <EditTunjanganTidakTetapModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Tambah Tunjangan Baru"
        confirmTitleButton="Tambah"
      />
    );

    expect(screen.getByText('Tambah Tunjangan Baru')).toBeInTheDocument();
    expect(screen.getByText('Tambah')).toBeInTheDocument();
  });

  it('seharusnya memanggil setField saat input nama tunjangan berubah', () => {
    render(
      <EditTunjanganTidakTetapModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Masukkan nama tunjangan');
    fireEvent.change(input, { target: { value: 'Tunjangan Baru' } });

    expect(mockSetField).toHaveBeenCalledWith('namaTunjangan', 'Tunjangan Baru');
  });

  it('seharusnya memanggil setField saat deskripsi berubah', () => {
    render(
      <EditTunjanganTidakTetapModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Tulis description ...');
    fireEvent.change(input, { target: { value: 'Deskripsi Baru' } });

    expect(mockSetField).toHaveBeenCalledWith('deskripsiUmum', 'Deskripsi Baru');
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditTunjanganTidakTetapModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Simpan Perubahan');
    fireEvent.click(saveButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
