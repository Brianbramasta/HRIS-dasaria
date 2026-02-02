import { render, screen, fireEvent } from '@testing-library/react';
import EditTunjanganTransportasiModal from './EditTransportationAllowanceModal';
import { useEditTransportationAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditTransportationAllowanceModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditTransportationAllowanceModal', () => ({
  useEditTransportationAllowanceModal: jest.fn(),
}));

// Mock utils
jest.mock('@/utils/formatCurrency', () => ({
  formatCurrency: (val: number) => `Rp ${val}`,
  parseCurrency: (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10),
}));

describe('EditTunjanganTransportasiModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    transportasi: 'Motor',
    kategori: 'Staff',
    nominal: '150000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditTransportationAllowanceModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul yang benar', () => {
    render(
      <EditTunjanganTransportasiModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Tunjangan Transportasi')).toBeInTheDocument();
  });

  it('seharusnya menampilkan nilai default pada field dengan format currency untuk nominal', () => {
    render(
      <EditTunjanganTransportasiModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('Motor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Staff')).toBeInTheDocument();
    // Nominal diformat oleh formatCurrency mock: 150000 -> "Rp 150000"
    expect(screen.getByDisplayValue('Rp 150000')).toBeInTheDocument();
  });

  it('seharusnya field Transportasi dan Kategori disabled', () => {
    render(
      <EditTunjanganTransportasiModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('Motor')).toBeDisabled();
    expect(screen.getByDisplayValue('Staff')).toBeDisabled();
  });

  it('seharusnya memanggil setField saat input Nominal berubah', () => {
    render(
      <EditTunjanganTransportasiModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nominalInput = screen.getByDisplayValue('Rp 150000');
    fireEvent.change(nominalInput, { target: { value: '200000' } });

    expect(mockSetField).toHaveBeenCalledWith('nominal', '200000');
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditTunjanganTransportasiModal
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
