import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import usePengunduranDiri from '../../../hooks/usePengunduranDiri';
import { addNotification } from '../../../../../stores/notificationStore';
import Form from '../../../../../components/form/Form';
import Input from '../../../../../components/form/input/InputField';
import DropzoneComponent from '../../../../../components/form/form-elements/DropZone';

export default function FormResignPage() {
  const navigate = useNavigate();
  const { createPengunduranDiri, loading } = usePengunduranDiri({ autoFetch: false });

  const [form, setForm] = useState({
    idKaryawan: '',
    name: '',
    email: '',
    posisi: '',
    department: '',
    tanggalPengajuan: '',
    alasan: '',
    status: 'Pending',
  });

  const [files, setFiles] = useState<File[]>([]);
  const fileName = files[0]?.name ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropFiles = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.idKaryawan ||
      !form.name ||
      !form.email ||
      !form.posisi ||
      !form.department ||
      !form.tanggalPengajuan ||
      !form.alasan ||
      files.length === 0
    ) {
      addNotification({
        title: 'Form belum lengkap',
        description: 'Isi semua field dan unggah file sebelum submit.',
        variant: 'warning',
      });
      return;
    }

    try {
      await createPengunduranDiri(form);
      addNotification({
        title: 'Berhasil',
        description: 'Pengajuan pengunduran diri tersimpan.',
        variant: 'success',
      });
      navigate('/pengunduran-diri');
    } catch (err) {
        console.log('error',err)
      addNotification({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan data.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Pengunduran Diri</h1>
        <Button variant="outline" size="sm" onClick={() => {
          const url = `${window.location.origin}/pengunduran-diri/form`;
          navigator.clipboard.writeText(url);
          addNotification({ title: 'Tautan dibagikan', description: 'Link formulir disalin ke clipboard.', variant: 'info' });
        }}>Share</Button>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Nama Karyawan</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">ID Karyawan</label>
            <Input name="idKaryawan" value={form.idKaryawan} onChange={handleChange} required />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Tanggal Pengajuan</label>
            <Input type="text" placeholder="contoh: 28 Januari 2025" name="tanggalPengajuan" value={form.tanggalPengajuan} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Posisi</label>
            <Input name="posisi" value={form.posisi} onChange={handleChange} required />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Departemen</label>
            <Input name="department" value={form.department} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        {/* Alasan */}
        <div>
          <label className="mb-2 block text-sm font-medium">Alasan Pengunduran Diri</label>
          <textarea name="alasan" value={form.alasan} onChange={handleChange} className="w-full rounded border px-3 py-2" rows={4} required />
        </div>

        {/* Upload Surat */}
        <div>
          <label className="mb-2 block text-sm font-medium">Surat Pengunduran Diri</label>
          <DropzoneComponent onDrop={handleDropFiles} required />
          {fileName && <div className="mt-2 text-sm text-gray-600">File: {fileName}</div>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>Submit</Button>
        </div>
      </Form>
    </div>
  );
}