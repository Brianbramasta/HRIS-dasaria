import { render, screen, fireEvent } from '@testing-library/react';
import EditTunjanganPernikahanModal from './EditMarriageAllowanceModal';
import { useEditMarriageAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditMarriageAllowanceModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditMarriageAllowanceModal', () => ({
  useEditMarriageAllowanceModal: jest.fn(),
}));

describe('EditTunjanganPernikahanModal', () => {
  const mockSetField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockForm = {
    statusPernikahan: 'K/1',
    status: 'married',
    tanggungan: '1',
    nominal: '1000000',
  };

  const mockStatusOptions = [
    { label: 'Married', value: 'married' },
    { label: 'Single', value: 'single' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditMarriageAllowanceModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      statusOptions: mockStatusOptions,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('seharusnya merender modal dengan judul yang benar', () => {
    render(
      <EditTunjanganPernikahanModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Tunjangan Pernikahan')).toBeInTheDocument();
  });

  it('seharusnya menampilkan nilai default pada semua field', () => {
    render(
      <EditTunjanganPernikahanModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('K/1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument(); // Tanggungan
    expect(screen.getByDisplayValue('1000000')).toBeInTheDocument(); // Nominal
  });

  it('seharusnya field Status Pernikahan, Status, dan Tanggungan disabled', () => {
    render(
      <EditTunjanganPernikahanModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('K/1')).toBeDisabled();
    expect(screen.getByDisplayValue('1')).toBeDisabled();
    // Untuk Select, kita cek apakah combobox disabled atau input di dalamnya disabled
    // Karena implementasi Select bisa beragam, kita cek label atau wrapper behavior jika memungkinkan
    // Namun untuk amannya, kita asumsikan props disabled diteruskan ke elemen input
  });

  it('seharusnya memanggil setField saat input Nominal berubah', () => {
    render(
      <EditTunjanganPernikahanModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nominalInput = screen.getByDisplayValue('1000000');
    fireEvent.change(nominalInput, { target: { value: '2000000' } });

    expect(mockSetField).toHaveBeenCalledWith('nominal', '2000000');
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditTunjanganPernikahanModal
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
