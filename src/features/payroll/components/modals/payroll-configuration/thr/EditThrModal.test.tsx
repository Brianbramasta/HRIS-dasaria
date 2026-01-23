import { render, screen, fireEvent } from '@testing-library/react';
import EditThrModal from './EditThrModal';
import { useEditThrModal } from '@/features/payroll/hooks/modals/payroll-configuration/thr/useEditThrModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/thr/useEditThrModal', () => ({
  useEditThrModal: jest.fn(),
}));

describe('EditThrModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    lamaKerja: '1 Tahun',
    deskripsiUmum: 'THR 1x Gaji',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditThrModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul yang benar', () => {
    render(
      <EditThrModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Tunjangan Hari Raya')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan lama kerja')).toHaveValue('1 Tahun');
    expect(screen.getByPlaceholderText('Tulis description ...')).toHaveValue('THR 1x Gaji');
  });

  it('seharusnya memanggil setField saat input lama kerja berubah', () => {
    render(
      <EditThrModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Masukkan lama kerja');
    fireEvent.change(input, { target: { value: '2 Tahun' } });

    expect(mockSetField).toHaveBeenCalledWith('lamaKerja', '2 Tahun');
  });

  it('seharusnya memanggil setField saat deskripsi berubah', () => {
    render(
      <EditThrModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Tulis description ...');
    fireEvent.change(input, { target: { value: 'THR 2x Gaji' } });

    expect(mockSetField).toHaveBeenCalledWith('deskripsiUmum', 'THR 2x Gaji');
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditThrModal
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
