import { render, screen, fireEvent } from '@testing-library/react';
import NonRecurringDeductionModalDelete from './NonRecurringDeductionModalDelete';
import '@testing-library/jest-dom';

describe('NonRecurringDeductionModalDelete', () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya merender modal konfirmasi dengan nama potongan yang benar', () => {
    render(
      <NonRecurringDeductionModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        deductionName="Potongan Kasbon"
      />
    );

    expect(screen.getByText('Hapus Data')).toBeInTheDocument();
    expect(screen.getByText(/Potongan Kasbon/)).toBeInTheDocument();
    expect(screen.getByText(/Apakah Anda yakin ingin menghapus/)).toBeInTheDocument();
  });

  it('seharusnya memanggil onDelete saat form disubmit (tombol Hapus diklik)', () => {
    render(
      <NonRecurringDeductionModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        deductionName="Potongan Kasbon"
      />
    );

    const deleteButton = screen.getByText('Hapus');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('seharusnya memanggil onClose saat tombol Tutup diklik', () => {
    render(
      <NonRecurringDeductionModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        deductionName="Potongan Kasbon"
      />
    );

    const closeButton = screen.getByText('Tutup');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
