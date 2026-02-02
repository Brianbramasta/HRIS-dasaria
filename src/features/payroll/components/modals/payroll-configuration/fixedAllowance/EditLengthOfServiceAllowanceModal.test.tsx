import { render, screen, fireEvent } from '@testing-library/react';
import EditTunjanganLamaKerjaModal from './EditLengthOfServiceAllowanceModal';
import { useEditLengthOfServiceAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditLengthOfServiceAllowanceModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditLengthOfServiceAllowanceModal', () => ({
  useEditLengthOfServiceAllowanceModal: jest.fn(),
}));

describe('EditTunjanganLamaKerjaModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    lamaKerja: 'Tahun Ke-5',
    nominal: '5000000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditLengthOfServiceAllowanceModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul yang benar', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Tunjangan Lama Kerja')).toBeInTheDocument();
  });

  it('seharusnya menampilkan nilai default pada input', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('Tahun Ke-5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000000')).toBeInTheDocument();
  });

  it('seharusnya input Lama Kerja dalam keadaan disabled (read-only)', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const lamaKerjaInput = screen.getByDisplayValue('Tahun Ke-5');
    expect(lamaKerjaInput).toBeDisabled();
  });

  it('seharusnya memanggil setField saat input Nominal berubah', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nominalInput = screen.getByDisplayValue('5000000');
    fireEvent.change(nominalInput, { target: { value: '6000000' } });

    expect(mockSetField).toHaveBeenCalledWith('nominal', '6000000');
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Simpan Perubahan');
    fireEvent.click(saveButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('seharusnya menampilkan state loading pada tombol simpan', () => {
    render(
      <EditTunjanganLamaKerjaModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        isLoading={true}
      />
    );

    // ModalAddEdit biasanya mengubah text atau disable button saat loading
    // Kita asumsikan button menjadi disabled atau menampilkan indikator loading
    // Berdasarkan implementasi umum ModalAddEdit, kita cek apakah button disabled
    const saveButton = screen.getByText('Simpan Perubahan');
    expect(saveButton).toBeDisabled();
  });
});
