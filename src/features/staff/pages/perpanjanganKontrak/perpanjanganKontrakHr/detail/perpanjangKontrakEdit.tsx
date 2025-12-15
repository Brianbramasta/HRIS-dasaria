import { useState } from 'react';
import { useNavigate, /*useParams*/ } from 'react-router-dom';
import PayrollCard from '@/features/penggajian/components/cards/cards';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import EditStatusPerpanjanganModal from '@/features/staff/components/modals/dataKaryawan/perpanjanganKontrak/editStatusPerpanjanganModal';
import EditPengajuanKontrakModal from '@/features/staff/components/modals/dataKaryawan/perpanjanganKontrak/editPengajuanKontrakModal';
import { ChevronLeft } from 'react-feather';

// Mock data - replace with actual API call
const mockKontrakData = {
  idKaryawan: '12345678',
  pengguna: 'Budi',
  posisi: 'HR',
  departemen: 'HR',
  tanggalMasuk: '01/01/2024',
  tanggalBerakhir: '31/12/2024',
  sisaKontrak: '2 bulan',
  statusPerpanjangan: 'Diperpanjang',
  statusAtasan: 'Disetujui',
  statusKaryawan: 'Disetujui',
  catatan: 'Detail Catatan ...',
  jenisPerubahan: 'Tidak ada',
  perusahaan: 'Dasaria',
  kantor: 'Head Kantor',
  direktorat: 'SDM',
  divisi: 'HR',
  position: 'HR',
  jabatan: 'EntryLevel',
  golongan: 'D5',
  jenjangJabatan: 'Senior',
  gajiPokok: '4.000.000',
  kategoriKaryawan: 'Staff',
};



export default function PerpanjangKontrakEdit() {
  const navigate = useNavigate();
//   const { id } = useParams();

  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPengajuanModalOpen, setIsPengajuanModalOpen] = useState(false);

  const handleStatusSuccess = () => {
    // TODO: Refresh data after update
    console.log('Status updated successfully');
  };

  const handlePengajuanSuccess = () => {
    // TODO: Refresh data after update
    console.log('Pengajuan updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Perpanjangan Kontrak</h1>
      </div>

      {/* Card 1: Detail Perpanjangan Kontrak */}
      <PayrollCard
        title="Status Perpanjangan"
        headerColor="slate"
       
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Karyawan</label>
            <Input type="text" value={mockKontrakData.idKaryawan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pengguna</label>
            <Input type="text" value={mockKontrakData.pengguna} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posisi</label>
            <Input type="text" value={mockKontrakData.posisi} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
            <Input type="text" value={mockKontrakData.departemen} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Masuk</label>
            <Input type="text" value={mockKontrakData.tanggalMasuk} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Berakhir</label>
            <Input type="text" value={mockKontrakData.tanggalBerakhir} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sisa Kontrak</label>
            <Input type="text" value={mockKontrakData.sisaKontrak} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Perpanjangan</label>
            <Input type="text" value={mockKontrakData.statusPerpanjangan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Atasan</label>
            <Input type="text" value={mockKontrakData.statusAtasan} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Karyawan</label>
            <Input type="text" value={mockKontrakData.statusKaryawan} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
          <TextArea value={mockKontrakData.catatan} disabled />
        </div>
        <div className='flex justify-end'>
        <Button
            onClick={() => setIsStatusModalOpen(true)}
            variant="primary"
            size="sm"
           
          >
            Edit
          </Button>
        </div>
      </PayrollCard>

      {/* Card 2: Pengajuan Kontrak */}
      <PayrollCard
        title="Pengajuan Kontrak"
        headerColor="green"
        
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Perubahan</label>
            <Input type="text" value={mockKontrakData.jenisPerubahan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</label>
            <Input type="text" value={mockKontrakData.perusahaan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kantor</label>
            <Input type="text" value={mockKontrakData.kantor} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direktorat</label>
            <Input type="text" value={mockKontrakData.direktorat} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Divisi</label>
            <Input type="text" value={mockKontrakData.divisi} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
            <Input type="text" value={mockKontrakData.departemen} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
            <Input type="text" value={mockKontrakData.position} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
            <Input type="text" value={mockKontrakData.jabatan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Golongan</label>
            <Input type="text" value={mockKontrakData.golongan} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang Jabatan</label>
            <Input type="text" value={mockKontrakData.jenjangJabatan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gaji Pokok</label>
            <Input type="text" value={mockKontrakData.gajiPokok} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Karyawan</label>
            <Input type="text" value={mockKontrakData.kategoriKaryawan} disabled />
          </div>
        </div>
        <div className='flex justify-end'>
        <Button
            onClick={() => setIsPengajuanModalOpen(true)}
            variant="primary"
            size="sm"
           
          >
            Edit
          </Button>
        </div>
      </PayrollCard>

      {/* Modal: Edit Status Perpanjangan */}
      <EditStatusPerpanjanganModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        kontrakData={mockKontrakData}
        onSuccess={handleStatusSuccess}
      />

      {/* Modal: Edit Pengajuan Kontrak */}
      <EditPengajuanKontrakModal
        isOpen={isPengajuanModalOpen}
        onClose={() => setIsPengajuanModalOpen(false)}
        kontrakData={mockKontrakData}
        onSuccess={handlePengajuanSuccess}
      />
    </div>
  );
}
