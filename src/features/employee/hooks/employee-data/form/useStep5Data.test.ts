import { renderHook, waitFor, act } from '@testing-library/react';
import { useStep5Data } from './useStep5Data';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import * as useFormulirKaryawan from './useFormulirKaryawan';

// Mock dependencies
jest.mock('@/features/employee/stores/useFormulirKaryawanStore');
jest.mock('./useFormulirKaryawan', () => ({
  getFieldDocument: jest.fn(),
}));

// Mock URL.createObjectURL
if (!('URL' in global)) {
  (global as any).URL = {} as any;
}
(global as any).URL.createObjectURL = jest.fn(() => 'mock-url');

describe('useStep5Data', () => {
  const mockUpdateStep4 = jest.fn();
  const mockStep3 = { kategoriKaryawan: 'cat-1' };
  const mockStep4 = { documents: [] };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
      formData: {
        step3Employee: mockStep3,
        step4: mockStep4,
      },
      updateStep4: mockUpdateStep4,
    });
  });

  it('seharusnya memuat field dokumen berdasarkan kategori', async () => {
    const mockDocs = [
      { id: '1', document_category: 'Pribadi', name: 'KTP' },
      { id: '2', document_category: 'Legal', name: 'Kontrak' },
    ];
    (useFormulirKaryawan.getFieldDocument as jest.Mock).mockResolvedValue(mockDocs);

    const { result } = renderHook(() => useStep5Data());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.personalDocuments).toHaveLength(1);
    expect(result.current.legalDocuments).toHaveLength(1);
  });

  it('seharusnya menangani upload file baru', () => {
    const { result } = renderHook(() => useStep5Data());
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange('doc-1', event);
    });

    expect(mockUpdateStep4).toHaveBeenCalledWith({
      documents: expect.arrayContaining([
        expect.objectContaining({
          tipeFile: 'doc-1',
          namaFile: 'test.pdf',
          filePath: 'mock-url',
        }),
      ]),
    });
  });

  it('seharusnya menghapus dokumen jika file input kosong', () => {
    const existingDoc = { tipeFile: 'doc-1', namaFile: 'test.pdf' };
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: {
            step3Employee: mockStep3,
            step4: { documents: [existingDoc] },
        },
        updateStep4: mockUpdateStep4,
    });

    const { result } = renderHook(() => useStep5Data());
    const event = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange('doc-1', event);
    });

    expect(mockUpdateStep4).toHaveBeenCalledWith({ documents: [] });
  });
  
  it('seharusnya mendapatkan file untuk field tertentu', () => {
    const existingDoc = { tipeFile: 'doc-1', namaFile: 'test.pdf' };
    (useFormulirKaryawanStore as unknown as jest.Mock).mockReturnValue({
        formData: {
            step3Employee: mockStep3,
            step4: { documents: [existingDoc] },
        },
        updateStep4: mockUpdateStep4,
    });

    const { result } = renderHook(() => useStep5Data());
    const doc = result.current.getFileForField('doc-1');
    expect(doc).toEqual(existingDoc);
  });
});
