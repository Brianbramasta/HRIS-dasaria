import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AddBusinessLineModal from './AddBusinessLineModal';
import { useAddBusinessLineModal } from '../../../hooks/modals/business-lines/useAddBusinessLineModal';

jest.mock('../../../../../components/shared/modal/ModalAddEdit', () => ({
  __esModule: true,
  default: ({ isOpen, title, onClose, handleSubmit, content }: any) => {
    if (!isOpen) return null;

    return (
      <div>
        <h1>{title}</h1>
        <button onClick={onClose}>tutup</button>
        <button onClick={handleSubmit}>simpan</button>
        <div data-testid="modal-content">{content}</div>
      </div>
    );
  },
}));

jest.mock('../../../../../components/shared/form/FileInput', () => ({
  __esModule: true,
  default: ({ skFileName, onChange, required }: any) => (
    <div>
      <span data-testid="file-name">{skFileName}</span>
      <input
        type="file"
        data-testid="file-input"
        aria-label="file input"
        onChange={onChange}
        required={required}
      />
    </div>
  ),
}));

jest.mock('@/components/shared/field/InputField', () => ({
  __esModule: true,
  default: ({ label, value, onChange, ...rest }: any) => (
    <label>
      {label}
      <input
        aria-label={label}
        data-testid={label}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  ),
}));

jest.mock('@/components/shared/field/TextAreaField', () => ({
  __esModule: true,
  default: ({ label, value, onChange, ...rest }: any) => (
    <label>
      {label}
      <textarea
        aria-label={label}
        data-testid={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  ),
}));

jest.mock(
  '../../../hooks/modals/business-lines/useAddBusinessLineModal',
  () => ({
    __esModule: true,
    useAddBusinessLineModal: jest.fn(),
  })
);

const mockedUseAddBusinessLineModal =
  useAddBusinessLineModal as jest.MockedFunction<
    typeof useAddBusinessLineModal
  >;

describe('AddBusinessLineModal', () => {
  const setName = jest.fn();
  const setMemoNumber = jest.fn();
  const setDescription = jest.fn();
  const handleFileChange = jest.fn();
  const handleSubmit = jest.fn();

  const setupHookMock = () => {
    mockedUseAddBusinessLineModal.mockReturnValue({
      name: 'Nama Awal',
      setName,
      memoNumber: 'MEMO-001',
      setMemoNumber,
      description: 'Deskripsi awal',
      setDescription,
      skFile: { name: 'memo.pdf' } as any,
      submitting: false,
      handleFileChange,
      handleSubmit,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupHookMock();
  });

  it('menampilkan judul dan field ketika modal dibuka', () => {
    expect(React).toBeDefined();
    render(
      <AddBusinessLineModal
        isOpen
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Tambah Lini Bisnis' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nama Lini Bisnis')).toBeInTheDocument();
    expect(
      screen.getByLabelText('No. Surat Keputusan / Memo Internal')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Deksripsi Umum')).toBeInTheDocument();
    expect(screen.getByTestId('file-name')).toHaveTextContent('memo.pdf');
  });

  it('memanggil setter hook saat nilai input diubah', () => {
    render(
      <AddBusinessLineModal
        isOpen
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('Nama Lini Bisnis'), {
      target: { value: 'Nama Baru' },
    });
    expect(setName).toHaveBeenCalledWith('Nama Baru');

    fireEvent.change(
      screen.getByLabelText('No. Surat Keputusan / Memo Internal'),
      {
        target: { value: 'MEMO-002' },
      }
    );
    expect(setMemoNumber).toHaveBeenCalledWith('MEMO-002');

    fireEvent.change(screen.getByLabelText('Deksripsi Umum'), {
      target: { value: 'Deskripsi baru' },
    });
    expect(setDescription).toHaveBeenCalledWith('Deskripsi baru');
  });

  it('memanggil handleFileChange ketika file dipilih', () => {
    render(
      <AddBusinessLineModal
        isOpen
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, {
      target: { files: [new File(['dummy'], 'file.pdf')] },
    });

    expect(handleFileChange).toHaveBeenCalled();
  });

  it('memanggil handleSubmit ketika tombol simpan diklik', () => {
    render(
      <AddBusinessLineModal
        isOpen
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('simpan'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('tidak merender konten ketika modal tertutup', () => {
    render(
      <AddBusinessLineModal
        isOpen={false}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(
      screen.queryByRole('heading', { name: 'Tambah Lini Bisnis' })
    ).not.toBeInTheDocument();
  });
});
