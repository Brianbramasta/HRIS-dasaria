import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import { PengunduranDiri } from '../../../types/PengunduranDiri';
import pengunduranDiriService from '../../../services/pengunduranDiriService';
import { addNotification } from '../../../../../stores/notificationStore';
import Label from '../../../../../components/form/Label';
// import Input from '../../../../../components/form/input/InputField';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import {IconHapus, IconPlus} from '@/icons/components/icons'

export default function DetailPengunduranDiriPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PengunduranDiri | null>(null);
  const [loading, setLoading] = useState(false);
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [docs, setDocs] = useState<Array<{ tipeFile: string; namaFile: string }>>([
    { tipeFile: 'Form Exit Discussion', namaFile: 'Form Exit Discussion.pdf' },
    { tipeFile: 'Surat Balasan Resign', namaFile: 'Surat Balasan Resign.pdf' },
    { tipeFile: 'Berita Acara Serah Terima (BAST)', namaFile: 'BAST.pdf' },
    { tipeFile: 'Form Exit Clearance', namaFile: 'Form Exit Clearance.pdf' },
    { tipeFile: 'Form Exit Interview', namaFile: 'Form Exit Interview.pdf' },
    { tipeFile: 'Form Exit Questionnaire', namaFile: 'Form Exit Questionnaire.pdf' },
    { tipeFile: 'Informasi Garden Leave', namaFile: 'Informasi Garden Leave.pdf' },
    { tipeFile: 'Paklaring (jika ada)', namaFile: 'Paklaring.pdf' },
  ]);

  const docTypes = [
    'Form Exit Discussion',
    'Surat Balasan Resign',
    'Berita Acara Serah Terima (BAST)',
    'Form Exit Clearance',
    'Form Exit Interview',
    'Form Exit Questionnaire',
    'Informasi Garden Leave',
    'Paklaring (jika ada)',
  ];

  const [uploadRows, setUploadRows] = useState<{ id: number; type: string; file?: File }[]>([
    { id: 1, type: '' },
  ]);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await pengunduranDiriService.getPengunduranDiriById(id);
        setData(res.data as unknown as PengunduranDiri);
      } catch (err) {
        console.log('error',err)
        addNotification({ title: 'Gagal memuat data', description: 'Tidak dapat mengambil detail pengunduran diri.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApprove = async () => {
    if (!id || !tanggalEfektif) {
      addNotification({ title: 'Tanggal efektif kosong', description: 'Isi tanggal efektif sebelum approve.', variant: 'warning' });
      return;
    }
    try {
      await pengunduranDiriService.approvePengunduranDiri(id, tanggalEfektif);
      addNotification({ title: 'Approved', description: 'Pengunduran diri disetujui.', variant: 'success' });
      navigate('/pengunduran-diri');
    } catch (err) {
        console.log('error',err)
      addNotification({ title: 'Gagal approve', description: 'Terjadi kesalahan saat approve.', variant: 'error' });
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await pengunduranDiriService.rejectPengunduranDiri(id);
      addNotification({ title: 'Rejected', description: 'Pengunduran diri ditolak.', variant: 'info' });
      navigate('/pengunduran-diri');
    } catch (err) {
        console.log('error',err)
      addNotification({ title: 'Gagal reject', description: 'Terjadi kesalahan saat reject.', variant: 'error' });
    }
  };

  const handleAddRow = () => {
    setUploadRows((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [...prev, { id: nextId, type: '' }];
    });
  };

  const handleRemoveRow = (id: number) => {
    setUploadRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowTypeChange = (id: number, type: string) => {
    setUploadRows((prev) => prev.map((r) => (r.id === id ? { ...r, type } : r)));
  };

  const handleRowFileChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadRows((prev) => prev.map((r) => (r.id === id ? { ...r, file } : r)));
  };

  const handleUploadRows = () => {
    const newItems = uploadRows
      .filter((r) => r.type && r.file)
      .map((r) => ({ tipeFile: r.type, namaFile: r.file!.name }));
    if (!newItems.length) {
      addNotification({ title: 'Tidak ada file', description: 'Pilih tipe dan file sebelum upload.', variant: 'warning' });
      return;
    }
    setDocs((prev) => [...newItems, ...prev]);
    addNotification({ title: 'Berhasil', description: 'File ditambahkan ke daftar secara lokal.', variant: 'success' });
  };

  if (loading) {
    return <div>Memuat...</div>;
  }

  if (!data) {
    return <div>Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengunduran Diri</h1>

      {/* Header card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Preview image + button */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                data.avatar ||
                'https://images.unsplash.com/photo-1544511852-3dfd9dcbf5a0?q=80&w=540&auto=format&fit=crop'
              }
              alt="Preview"
              className="h-full w-40 rounded object-cover"
            />
            <Button size="sm" variant="primary" onClick={() => addNotification({ title: 'Preview PDF', description: 'Static preview only.', variant: 'info' })}>
              Preview PDF
            </Button>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600">Nama Lengkap</div>
                <div className="font-medium">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">ID Karyawan</div>
                <div className="font-medium">{data.idKaryawan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
                <div className="font-medium">{data.tanggalPengajuan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sisa Kontrak</div>
                <div className="font-medium">5 Bulan</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posisi</div>
                <div className="font-medium">{data.posisi || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Jenis Kontrak</div>
                <div className="font-medium">PKWT</div>
              </div>
            </div>
            <div className="mt-6">
              <Label>Alasan Pengunduran Diri</Label>
              <TextArea placeholder="Enter as description ..." value={data.alasan} disabled rows={3} />
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
                  {docTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Upload file</Label>
                <div className="grid grid-cols-1 gap-3  items-center">
                  <FileInput onChange={(e) => handleRowFileChange(row.id, e)} />
                </div>
              </div>
              <div className="self-end md:self-auto">
                {index === 0 ? (
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-green-500 text-white w-full md:w-fit" onClick={handleAddRow}><IconPlus color='white'/></Button>
                ) : (
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-red-500 text-white w-full md:w-fit" onClick={() => handleRemoveRow(row.id)}><IconHapus color='white'/></Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" size="sm" variant="primary" onClick={handleUploadRows}>Upload</Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table className='border'>
            <TableHeader>
              <TableRow className='bg-[#004969] text-white'>
                <TableCell isHeader className="px-4 py-2 ">No.</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Tipe File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Nama File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Action</TableCell>
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
                    <Button variant="custom" size="sm" className="btn-danger" onClick={() => setDocs((prev) => prev.filter((_, idx) => idx !== i))}><IconHapus/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end">
        {/* <div className="flex items-center gap-3">
          <Label>Tanggal Efektif</Label>
          <Input type="text" placeholder="28 Januari 1999" value={tanggalEfektif} onChange={(e) => setTanggalEfektif(e.target.value)} />
        </div> */}
        <div className="flex items-center gap-3">
          <Button variant="custom" className="border border-[#DC3545] text-[#DC3545]" onClick={handleReject}>Ditolak</Button>
          <Button variant="custom" className="bg-green-500 text-white" onClick={handleApprove}>Disetujui</Button>
        </div>
      </div>
    </div>
  );
}