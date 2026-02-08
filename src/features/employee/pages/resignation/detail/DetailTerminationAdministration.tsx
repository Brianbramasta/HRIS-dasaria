import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import Label from '../../../../../components/form/Label';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import DoneOffBoardingModal from '../../../components/modals/resignation/DoneOffBoardingModal';

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
  const [docs, setDocs] = useState<DocRow[]>([
    { tipeFile: 'Form Exit Discussion', namaFile: 'Form Exit Discussion.pdf' },
    { tipeFile: 'Surat Balasan Pengunduran Diri', namaFile: 'Surat Balasan Pengunduran Diri.pdf' },
    { tipeFile: 'Berita Acara Serah Terima (BAST)', namaFile: 'BAST.pdf' },
  ]);
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const data: DetailData | null = useMemo(() => {
    return {
      name: 'Budi',
      idKaryawan: 'DSR999',
      posisi: 'Direktur Teknologi dan Jaringan',
      statusBerakhir: 'PHK',
      tanggalPengajuan: '28 Januari 1999',
      tanggalEfektif: '28 Februari 1999',
      catatan: '',
      avatar:
        'https://images.unsplash.com/photo-1544511852-3dfd9dcbf5a0?q=80&w=540&auto=format&fit=crop',
    };
  }, [id]);

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

  const handleUploadRows = () => {
    const newDocs = uploadRows
      .filter((r) => r.type && r.file)
      .map((r) => ({ tipeFile: r.type, namaFile: r.file?.name || '' }));
    if (newDocs.length > 0) {
      setDocs((prev) => [...prev, ...newDocs]);
      setUploadRows([{ id: crypto.randomUUID(), type: '' }]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreviewPDF = () => {};
  const handleOpenDone = () => setIsDoneOpen(true);
  const handleCloseDone = () => setIsDoneOpen(false);
  const handleConfirmDone = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDoneOpen(false);
    }, 800);
  };

  if (!data) {
    return <div>Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terminasi Administrasi</h1>

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
              <TextArea placeholder="Enter as description ..." value={data.catatan} rows={3} />
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
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  <option value="Form Exit Discussion">Form Exit Discussion</option>
                  <option value="Surat Balasan Pengunduran Diri">Surat Balasan Pengunduran Diri</option>
                  <option value="BAST">Berita Acara Serah Terima (BAST)</option>
                  <option value="Form Exit Clearance">Form Exit Clearance</option>
                  <option value="Form Exit Interview">Form Exit Interview</option>
                  <option value="Form Exit Questionnaire">Form Exit Questionnaire</option>
                  <option value="Informasi Garden Leave">Informasi Garden Leave</option>
                  <option value="Pelatihan">Pelatihan</option>
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
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-green-500 text-white w-full md:w-fit" onClick={handleAddRow}>+</Button>
                ) : (
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-red-500 text-white w-full md:w-fit" onClick={() => handleRemoveRow(row.id)}>−</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" size="sm" variant="primary" onClick={handleUploadRows}>Unggah</Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-[#004969] text-white">
                <TableCell isHeader className="px-4 py-2">No.</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">Tipe File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">Nama File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 && (
                <TableRow>
                  <TableCell className="px-4 py-3" colSpan={4}>Belum ada dokumen</TableCell>
                </TableRow>
              )}
              {docs.map((d, i) => (
                <TableRow key={`${d.namaFile}-${i}`} className="border-t border-gray-200 dark:border-gray-800">
                  <TableCell className="px-4 py-3">{i + 1}</TableCell>
                  <TableCell className="px-4 py-3">{d.tipeFile}</TableCell>
                  <TableCell className="px-4 py-3">{d.namaFile}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Button variant="custom" size="sm" className="btn-danger" onClick={() => handleRemoveDocument(i)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button variant="custom" className="border border-gray-300">Tutup</Button>
          <Button variant="custom" className="bg-green-500 text-white" onClick={handleOpenDone}>Selesai</Button>
        </div>
      </div>

      <DoneOffBoardingModal
        isOpen={isDoneOpen}
        onClose={handleCloseDone}
        onConfirm={handleConfirmDone}
        submitting={isSubmitting}
        employeeName={data.name}
        effectiveDate={data.tanggalEfektif}
      />
    </div>
  );
}
