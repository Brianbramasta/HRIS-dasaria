import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import EditStatusPerpanjanganModal from '@/features/employee/components/modals/employeeData/perpanjanganKontrak/editStatusPerpanjanganModal';
import EditPengajuanKontrakModal from '@/features/employee/components/modals/employeeData/perpanjanganKontrak/editPengajuanKontrakModal';
import { useEditContractRenewal } from '../../../../hooks/contract-renewal/useEditContractRenewal';



export default function PerpanjangKontrakEdit() {
  const {
    kontrakData,
    isLoading,
    isStatusModalOpen,
    isPengajuanModalOpen,
    setIsStatusModalOpen,
    setIsPengajuanModalOpen,
    handleGoBack,
    handleUpdateStatus,
    handleUpdatePengajuan,
  } = useEditContractRenewal();

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
            <Input type="text" value={kontrakData.employee_id || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pengguna</label>
            <Input type="text" value={kontrakData.status_perpanjangan.employee_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posisi</label>
            <Input type="text" value={kontrakData.status_perpanjangan.position_name || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
            <Input type="text" value={kontrakData.status_perpanjangan.department_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Masuk</label>
            <Input type="text" value={kontrakData.status_perpanjangan.start_date || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Berakhir</label>
            <Input type="text" value={kontrakData.status_perpanjangan.end_date || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sisa Kontrak</label>
            <Input type="text" value={kontrakData.status_perpanjangan.remaining_contract || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Perpanjangan</label>
            <Input type="text" value={kontrakData.status_perpanjangan.renewal_status_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Atasan</label>
            <Input type="text" value={kontrakData.status_perpanjangan.supervisor_approval_status_name || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Karyawan</label>
            <Input type="text" value={kontrakData.status_perpanjangan.employee_status_name || ''} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
          <TextArea value={kontrakData.status_perpanjangan.notes || ''} disabled />
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
            <Input type="text" value={kontrakData.pengajuan_kontrak.change_type_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.company_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kantor</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.office_name || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direktorat</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.directorate_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Divisi</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.division_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.department_name || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.position_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.job_title_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Golongan</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.grade || ''} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang Jabatan</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.position_level_name || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gaji Pokok</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.basic_salary?.toString() || ''} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Karyawan</label>
            <Input type="text" value={kontrakData.pengajuan_kontrak.employee_category_name || ''} disabled />
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
        kontrakData={kontrakData.status_perpanjangan}
        onSuccess={handleUpdateStatus}
      />

      {/* Modal: Edit Pengajuan Kontrak */}
      <EditPengajuanKontrakModal
        isOpen={isPengajuanModalOpen}
        onClose={() => setIsPengajuanModalOpen(false)}
        kontrakData={kontrakData.pengajuan_kontrak}
        onSuccess={handleUpdatePengajuan}
      />
    </div>
  );
}
