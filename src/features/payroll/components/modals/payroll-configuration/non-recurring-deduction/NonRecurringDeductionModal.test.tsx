import { render, screen, fireEvent } from '@testing-library/react';
import NonRecurringDeductionModal from './NonRecurringDeductionModal';
import { useNonRecurringDeductionModal } from '@/features/payroll/hooks/modals/payroll-configuration/non-recurring-deduction/useNonRecurringDeductionModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/non-recurring-deduction/useNonRecurringDeductionModal', () => ({
  useNonRecurringDeductionModal: jest.fn(),
}));

describe('NonRecurringDeductionModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    namaPotongan: 'Potongan Terlambat',
    kategori: 'Potongan tidak tetap',
    deskripsiUmum: 'Denda keterlambatan',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNonRecurringDeductionModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul default yang benar', () => {
    render(
      <NonRecurringDeductionModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Potongan Tidak Tetap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan nama potongan')).toHaveValue('Potongan Terlambat');
    expect(screen.getByPlaceholderText('Tulis description ...')).toHaveValue('Denda keterlambatan');
  });

  it('seharusnya merender modal dengan judul kustom jika diberikan', () => {
    render(
      <NonRecurringDeductionModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Tambah Potongan"
        confirmTitleButton="Simpan"
      />
    );

    expect(screen.getByText('Tambah Potongan')).toBeInTheDocument();
    expect(screen.getByText('Simpan')).toBeInTheDocument();
  });

  it('seharusnya memanggil setField saat input nama potongan berubah', () => {
    render(
      <NonRecurringDeductionModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Masukkan nama potongan');
    fireEvent.change(input, { target: { value: 'Potongan Baru' } });

    expect(mockSetField).toHaveBeenCalledWith('namaPotongan', 'Potongan Baru');
  });

  it('seharusnya memanggil setField saat deskripsi berubah', () => {
    render(
      <NonRecurringDeductionModal
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
      <NonRecurringDeductionModal
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
