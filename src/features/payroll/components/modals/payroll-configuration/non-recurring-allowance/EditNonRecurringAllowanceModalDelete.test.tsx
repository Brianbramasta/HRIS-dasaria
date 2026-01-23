import { render, screen, fireEvent } from '@testing-library/react';
import EditNonRecurringAllowanceModalDelete from './EditNonRecurringAllowanceModalDelete';
import '@testing-library/jest-dom';

describe('EditNonRecurringAllowanceModalDelete', () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya tidak merender apapun jika isOpen false', () => {
    render(
      <EditNonRecurringAllowanceModalDelete
        isOpen={false}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    
    // Modal biasanya tidak ada di DOM jika isOpen false, atau hidden.
    // Asumsi implementasi Modal dari ui/modal menghilangkannya dari DOM atau menyembunyikannya.
    // Kita cek teks "Hapus Data" tidak muncul.
    expect(screen.queryByText('Hapus Data')).not.toBeInTheDocument();
  });

  it('seharusnya merender modal konfirmasi dengan nama tunjangan yang benar', () => {
    render(
      <EditNonRecurringAllowanceModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        allowanceName="Bonus Tahunan"
      />
    );

    expect(screen.getByText('Hapus Data')).toBeInTheDocument();
    expect(screen.getByText(/Bonus Tahunan/)).toBeInTheDocument();
    expect(screen.getByText(/Apakah Anda yakin ingin menghapus/)).toBeInTheDocument();
  });

  it('seharusnya memanggil onDelete saat form disubmit (tombol Hapus diklik)', () => {
    render(
      <EditNonRecurringAllowanceModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        allowanceName="Bonus Tahunan"
      />
    );

    const deleteButton = screen.getByText('Hapus');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('seharusnya memanggil onClose saat tombol Tutup diklik', () => {
    render(
      <EditNonRecurringAllowanceModalDelete
        isOpen={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        allowanceName="Bonus Tahunan"
      />
    );

    const closeButton = screen.getByText('Tutup');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
