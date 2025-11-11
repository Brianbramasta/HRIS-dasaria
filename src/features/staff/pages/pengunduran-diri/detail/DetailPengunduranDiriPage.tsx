import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import { PengunduranDiri } from '../../../types/PengunduranDiri';
import pengunduranDiriService from '../../../services/pengunduranDiriService';
import { addNotification } from '../../../../../stores/notificationStore';

export default function DetailPengunduranDiriPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PengunduranDiri | null>(null);
  const [loading, setLoading] = useState(false);
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [docs, setDocs] = useState<Array<{ tipeFile: string; namaFile: string }>>([]);

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

  const handleUploadDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocs((prev) => [...prev, { tipeFile: 'Surat', namaFile: file.name }]);
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <img src={data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`} className="h-14 w-14 rounded" />
            <div>
              <div className="font-semibold">{data.name}</div>
              <div className="text-sm text-gray-600">ID: {data.idKaryawan}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
            <div className="font-medium">{data.tanggalPengajuan}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Posisi</div>
            <div className="font-medium">{data.posisi || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Departemen</div>
            <div className="font-medium">{data.department}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600">Alasan Pengunduran Diri</div>
            <textarea readOnly value={data.alasan} className="mt-1 w-full rounded border px-3 py-2" rows={3} />
          </div>
        </div>
      </div>

      {/* Berkas/Dokumen */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold">Berkas / Dokumen</div>
          <div className="flex items-center gap-3">
            <input type="file" onChange={handleUploadDoc} />
            <Button size="sm" variant="primary">Upload</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">No.</th>
                <th className="px-4 py-2 text-left">Tipe File</th>
                <th className="px-4 py-2 text-left">Nama File</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 && (
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Belum ada dokumen</td>
                </tr>
              )}
              {docs.map((d, i) => (
                <tr key={`${d.namaFile}-${i}`} className="border-t">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{d.tipeFile}</td>
                  <td className="px-4 py-3">{d.namaFile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm">Tanggal Efektif</label>
          <input type="text" placeholder="contoh: 28 Januari 2025" value={tanggalEfektif} onChange={(e) => setTanggalEfektif(e.target.value)} className="rounded border px-3 py-2" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/pengunduran-diri')}>Save Draft</Button>
          <Button variant="outline" className="btn-danger" onClick={handleReject}>Rejected</Button>
          <Button variant="primary" onClick={handleApprove}>Approved</Button>
        </div>
      </div>
    </div>
  );
}