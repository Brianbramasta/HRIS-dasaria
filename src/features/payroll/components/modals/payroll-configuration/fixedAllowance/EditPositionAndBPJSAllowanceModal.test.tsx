import { render, screen, fireEvent } from '@testing-library/react';
import EditDetailTunjanganJabatanDanBpjsModal from './EditPositionAndBPJSAllowanceModal';
import { useEditPositionAndBPJSAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditPositionAndBPJSAllowanceModal';
import '@testing-library/jest-dom';

// Mock hook
jest.mock('@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditPositionAndBPJSAllowanceModal', () => ({
  useEditPositionAndBPJSAllowanceModal: jest.fn(),
}));

// Mock TableGlobal to avoid icon import issues
jest.mock('@/features/structure-and-organize/components/table/TableGlobal', () => {
  return ({ items, columns }: any) => (
    <div data-testid="bpjs-table">
      {items.map((item: any, idx: number) => (
        <div key={idx} data-testid="bpjs-row">
          {columns.map((col: any) => (
            <div key={col.id}>{col.render ? col.render(item[col.id], item, idx) : item[col.id]}</div>
          ))}
        </div>
      ))}
    </div>
  );
});

describe('EditDetailTunjanganJabatanDanBpjsModal', () => {
  const mockSetField = jest.fn();
  const mockUpdateBpjs = jest.fn();
  const mockHandleSubmit = jest.fn();

  const mockForm = {
    jobLevelId: '1',
    jabatan: 'Manager',
    percent: '10',
    nominal: '',
    ketenagakerjaan: [
      { id: '1', jenisBpjs: 'JHT', selected: true, tt: true, pt: true, tunjanganId: 't1', potonganId: 'p1' }
    ],
    kesehatan: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditPositionAndBPJSAllowanceModal as jest.Mock).mockReturnValue({
      form: mockForm,
      setField: mockSetField,
      updateBpjs: mockUpdateBpjs,
      handleSubmit: mockHandleSubmit,
      jabatanOptions: [],
      errors: {},
    });
  });

  it('seharusnya merender modal dengan judul yang benar untuk mode edit', () => {
    render(
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
      />
    );

    expect(screen.getByText('Edit Tunjangan Jabatan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Manager')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('seharusnya merender modal dengan judul yang benar untuk mode detail', () => {
    render(
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={true}
        onClose={jest.fn()}
        mode="detail"
      />
    );

    expect(screen.getByText('Detail Tunjangan Jabatan')).toBeInTheDocument();
    // Inputs should be disabled or readonly in detail mode (checked via class or attribute if possible, but integration test mainly checks visibility)
    const percentInput = screen.getByDisplayValue('10');
    expect(percentInput).toBeDisabled();
  });

  it('seharusnya memanggil setField saat input berubah', () => {
    render(
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
      />
    );

    const percentInput = screen.getByDisplayValue('10');
    fireEvent.change(percentInput, { target: { value: '20' } });

    expect(mockSetField).toHaveBeenCalledWith('percent', '20');
  });

  it('seharusnya memanggil updateBpjs saat checkbox BPJS diklik', () => {
    render(
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
      />
    );

    // Finding checkbox might be tricky depending on implementation, assume label text is present
    const checkbox = screen.getByLabelText('JHT'); 
    fireEvent.click(checkbox);

    expect(mockUpdateBpjs).toHaveBeenCalledWith('ketenagakerjaan', '1', 'selected', false);
  });

  it('seharusnya memanggil handleSubmit saat tombol simpan diklik', () => {
    render(
      <EditDetailTunjanganJabatanDanBpjsModal
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
      />
    );

    const saveButton = screen.getByText('Simpan Perubahan');
    fireEvent.click(saveButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
