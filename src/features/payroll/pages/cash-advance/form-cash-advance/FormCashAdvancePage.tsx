

// Dokumentasi: Halaman Form Kasbon
// - Menyediakan form pengajuan kasbon dengan field: NIP, Nama Lengkap,
//   Departemen, Posisi, Gaji Pokok, Tanggal Pengajuan
// - Pola dan komponen mengikuti FormResignPage untuk konsistensi UI/UX
export default function FormKasbonPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { departments } = useDepartments();
  const { positions } = usePositions();

  const [form, setForm] = useState({
    idKaryawan: '',
    name: '',
    departmentId: '',
    posisiId: '',
    gajiPokok: '',
    tanggalPengajuan: '',
  });

  const departmentOptions = useMemo(() => (departments || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), [departments]);
  const positionOptions = useMemo(() => (positions || []).map(p => ({ value: (p as any).id ?? '', label: (p as any).name ?? '' })), [positions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dokumentasi: Submit Form Kasbon
  // - Validasi field wajib
  // - Tampilkan notifikasi sukses/gagal dan arahkan ke halaman kasbon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.idKaryawan ||
      !form.name ||
      !form.departmentId ||
      !form.posisiId ||
      !form.gajiPokok ||
      !form.tanggalPengajuan
    ) {
      addNotification({
        title: 'Form belum lengkap',
        description: 'Lengkapi semua field sebelum submit.',
        variant: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      // Simulasi submit: pada implementasi API, kirim payload ke endpoint kasbon
      const selectedDepartment = departmentOptions.find(d => d.value === form.departmentId)?.label || '';
      const selectedPosition = positionOptions.find(p => p.value === form.posisiId)?.label || '';
      const payload = {
        idKaryawan: form.idKaryawan,
        name: form.name,
        departmentId: form.departmentId,
        department: selectedDepartment,
        posisiId: form.posisiId,
        posisi: selectedPosition || undefined,
        gajiPokok: form.gajiPokok,
        tanggalPengajuan: form.tanggalPengajuan,
      } as any;
      console.log('submit kasbon', payload);

      addNotification({
        title: 'Berhasil',
        description: 'Pengajuan kasbon tersimpan.',
        variant: 'success',
      });
      navigate('/kasbon');
    } catch (err) {
        console.error('Error submitting form:', err);
      addNotification({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan data.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img src="/images/icons/form/dasaria-logo.png" alt="logo" className="h-12 w-auto" />
      <div className="space-y-6 bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Pengajuan Kasbon</h1>
          <Button
            variant="custom"
            size="sm"
            onClick={() => {
              const url = `${window.location.origin}/kasbon/form`;
              navigator.clipboard.writeText(url);
              addNotification({ title: 'Tautan dibagikan', description: 'Link formulir disalin ke clipboard.', variant: 'info' });
            }}
          >
            <IconShare />
            Bagikan
          </Button>
        </div>

        <div className=" border-b-[1px] border-[#000]  pb-4">
          <div className="text-sm text-gray-900 dark:text-white space-y-1">
            <div>Ketentuan Pengajuan Kasbon:</div>
            <ul className="list-disc pl-5">
              <li>Harap memasukkan NIP terlebih dahulu untuk melakukan pengecekan kelayakan pengajuan kasbon.</li>
              <li>Harap melampirkan dokumen yang diminta, yaitu: <b>Surat Persetujuan Atasan</b> dan <b>Surat Dokumen Pendukung</b>.</li>
              <li>Hanya format JPG dan PDF yang diperbolehkan. Ukuran maksimum masing-masing dokumen <b>10MB</b>.</li>
              <li>Contoh <b>Surat Persetujuan Atasan</b> bisa <a href="https://example.com/surat-persetujuan-atasan" className='text-blue-600' target="_blank" rel="noopener noreferrer">klik di sini</a>.</li>
            </ul>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">NIP</label>
              <Input name="idKaryawan" value={form.idKaryawan} onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Lengkap</label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Departemen</label>
              <Select
                options={departmentOptions}
                placeholder="Pilih Departemen"
                defaultValue={form.departmentId}
                onChange={(v) => setForm(prev => ({ ...prev, departmentId: v }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Posisi</label>
              <Select
                options={positionOptions}
                placeholder="Pilih Posisi"
                defaultValue={form.posisiId}
                onChange={(v) => setForm(prev => ({ ...prev, posisiId: v }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Gaji Pokok</label>
              <Input name="gajiPokok" value={form.gajiPokok} onChange={handleChange} required />
            </div>
            <div>
              <DatePicker
                id="tanggal-pengajuan"
                label="Tanggal Pengajuan"
                placeholder="hh/bb/tttt"
                defaultDate={form.tanggalPengajuan as any}
                onChange={(_d:any, dateStr:string) => setForm(prev => ({ ...prev, tanggalPengajuan: dateStr }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={loading}>Submit</Button>
          </div>
        </Form>
      </div>
    </>
  );
}
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import { addNotification } from '../../../../../stores/notificationStore';
import Form from '../../../../../components/form/Form';
import Input from '../../../../../components/form/input/InputField';
import DatePicker from '../../../../../components/form/date-picker';
import Select from '../../../../../components/form/Select';
import { useDepartments } from '../../../../structure-and-organize/hooks/useDepartments';
import { usePositions } from '../../../../structure-and-organize/hooks/usePositions';
import { IconShare } from '@/icons/components/icons';
