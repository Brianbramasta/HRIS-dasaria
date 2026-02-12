import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import Label from '../../../../../components/form/Label';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import DoneOffBoardingModal from '../../../components/modals/resignation/DoneOffBoardingModal';
import { useApiResignation } from '@/features/employee/hooks/api/useApiResignation';

type DetailData = {
  name: string;
  idKaryawan: string;
  posisi: string;
  statusBerakhir: string;
  tanggalPengajuan: string;
  tanggalEfektif: string;
  catatan: string;
  avatar?: string;
};

type UploadRow = { id: string; type: string; file?: File | null };
type DocRow = { tipeFile: string; namaFile: string };

export default function DetailTerminationAdministrationPage() {
  const { id } = useParams();
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([{ id: crypto.randomUUID(), type: '' }]);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const [comment, setComment] = useState('');

  const {
    loading,
    error,
    adminDetail,
    documentTypes,
    fetchAdministrationDetail,
    fetchDocumentTypes,
    uploadAdministrationDocuments,
    submitAdministration,
  } = useApiResignation();

  // Fetch detail and document types on mount
  useEffect(() => {
    if (id) {
      fetchAdministrationDetail(id);
      fetchDocumentTypes();
    }
  }, [id]);

  // Transform API data to component format
  const data: DetailData | null = useMemo(() => {
    if (!adminDetail) return null;
    return {
      name: adminDetail.resignation_details?.full_name || '',
      idKaryawan: adminDetail.resignation_details?.NIP || '',
      posisi: adminDetail.resignation_details?.position_name || '',
      statusBerakhir: adminDetail.resignation_details?.end_status || '',
      tanggalPengajuan: adminDetail.resignation_details?.tanggal_pengajuan_terminasi || '',
      tanggalEfektif: adminDetail.resignation_details?.tanggal_efektif_terminasi || '',
      catatan: adminDetail.resignation_details?.id || '',
      avatar: undefined,
    };
  }, [adminDetail]);

  // Transform documents from API
  useEffect(() => {
    if (adminDetail?.resignation_documents) {
      const transformedDocs = adminDetail.resignation_documents.map((doc) => ({
        tipeFile: doc.file_type_name || '-',
        namaFile: doc.document_name || '-',
      }));
      setDocs(transformedDocs);
    }
  }, [adminDetail?.resignation_documents]);

  const handleAddRow = () => {
    setUploadRows((rows) => [...rows, { id: crypto.randomUUID(), type: '' }]);
  };

  const handleRemoveRow = (rowId: string) => {
    setUploadRows((rows) => rows.filter((r) => r.id !== rowId));
  };

  const handleRowTypeChange = (rowId: string, value: string) => {
    setUploadRows((rows) => rows.map((r) => (r.id === rowId ? { ...r, type: value } : r)));
  };

  const handleRowFileChange = (rowId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadRows((rows) => rows.map((r) => (r.id === rowId ? { ...r, file } : r)));
  };

  const handleUploadRows = async () => {
    const filesToUpload = uploadRows.filter((r) => r.type && r.file);
    if (filesToUpload.length === 0) return;

    const success = await uploadAdministrationDocuments(id!, {
      document_type_ids: filesToUpload.map((r) => r.type),
      files: filesToUpload.map((r) => r.file!),
    });

    if (success) {
      const newDocs = filesToUpload.map((r) => {
        const docType = documentTypes.find((dt) => dt.id === r.type);
        return {
          tipeFile: docType ? (docType.file_type_name || docType.name || r.type) : r.type,
          namaFile: r.file?.name || '',
        };
      });
      setDocs((prev) => [...prev, ...newDocs]);
      setUploadRows([{ id: crypto.randomUUID(), type: '' }]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreviewPDF = () => {
    // TODO: Implement PDF preview
  };

  const handleOpenDone = () => setIsDoneOpen(true);
  const handleCloseDone = () => setIsDoneOpen(false);

  const handleConfirmDone = async () => {
    if (!id) return;
    const success = await submitAdministration(id);
    if (success) {
      setIsDoneOpen(false);
    }
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terminasi Administrasi</h1>
        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p>{error || 'Data tidak ditemukan.'}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terminasi Administrasi</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p>Terjadi kesalahan: {error}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                data.avatar ||
                'https://images.unsplash.com/photo-1544511852-3dfd9dcbf5a0?q=80&w=540&auto=format&fit=crop'
              }
              alt="Preview"
              className="h-full w-40 rounded object-cover"
            />
            <Button size="sm" variant="primary" onClick={handlePreviewPDF}>
              Pratinjau PDF
            </Button>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <div className="text-sm text-gray-600">Nama Lengkap</div>
                <div className="font-medium">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">NIP</div>
                <div className="font-medium">{data.idKaryawan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posisi</div>
                <div className="font-medium">{data.posisi}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status Berakhir</div>
                <div className="font-medium">{data.statusBerakhir}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
                <div className="font-medium">{data.tanggalPengajuan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Efektif</div>
                <div className="font-medium">{data.tanggalEfektif}</div>
              </div>
            </div>
            <div className="mt-6">
              <Label>Catatan</Label>
              <TextArea
                placeholder="Enter as description ..."
                value={comment}
                onChange={(value: any) => setComment(typeof value === 'string' ? value : value.target?.value || '')}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="font-semibold mb-4">Berkas / Dokumen</div>
        <div className="space-y-3">
          {uploadRows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label>Tipe File</Label>
                <select
                  value={row.type}
                  onChange={(e) => handleRowTypeChange(row.id, e.target.value)}
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  {documentTypes.map((dt) => (
                    <option key={dt.id} value={dt.id}>
                      {dt.file_type_name || dt.name || 'Unnamed'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Upload file</Label>
                <div className="grid grid-cols-1 gap-3 items-center">
                  <FileInput onChange={(e) => handleRowFileChange(row.id, e)} />
                </div>
              </div>
              <div className="self-end md:self-auto">
                {index === 0 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="custom"
                    className="px-3 py-3 rounded-full bg-green-500 text-white w-full md:w-fit disabled:opacity-50"
                    onClick={handleAddRow}
                    disabled={loading}
                  >
                    +
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="custom"
                    className="px-3 py-3 rounded-full bg-red-500 text-white w-full md:w-fit disabled:opacity-50"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={loading}
                  >
                    −
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleUploadRows}
            disabled={loading}
          >
            Unggah
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-[#004969] text-white">
                <TableCell isHeader className="px-4 py-2">
                  No.
                </TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">
                  Tipe File
                </TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">
                  Nama File
                </TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 && (
                <TableRow>
                  <TableCell className="px-4 py-3" colSpan={4}>
                    Belum ada dokumen
                  </TableCell>
                </TableRow>
              )}
              {docs.map((d, i) => (
                <TableRow key={`${d.namaFile}-${i}`} className="border-t border-gray-200 dark:border-gray-800">
                  <TableCell className="px-4 py-3">{i + 1}</TableCell>
                  <TableCell className="px-4 py-3">{d.tipeFile}</TableCell>
                  <TableCell className="px-4 py-3">{d.namaFile}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      variant="custom"
                      size="sm"
                      className="btn-danger"
                      onClick={() => handleRemoveDocument(i)}
                      disabled={loading}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button variant="custom" className="border border-gray-300">
            Tutup
          </Button>
          <Button
            variant="custom"
            className="bg-green-500 text-white disabled:opacity-50"
            onClick={handleOpenDone}
            disabled={loading}
          >
            Selesai
          </Button>
        </div>
      </div>

      <DoneOffBoardingModal
        isOpen={isDoneOpen}
        onClose={handleCloseDone}
        onConfirm={handleConfirmDone}
        submitting={loading}
        employeeName={data.name}
        effectiveDate={data.tanggalEfektif}
      />
    </div>
  );
}
