import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import useEditContractRenewalStatusModal from '@/features/employee/hooks/modals/contract-renewal/useEditContractRenewalStatusModal';

interface EditStatusPerpanjanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData?: {
    idKaryawan: string;
    pengguna: string;
    posisi: string;
    departemen: string;
    tanggalMasuk: string;
    tanggalBerakhir: string;
    sisaKontrak: string;
    statusPerpanjangan: string;
    statusAtasan: string;
    statusKaryawan: string;
    catatan: string;
  };
  onSuccess?: () => void;
}

export default function EditStatusPerpanjanganModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
}: EditStatusPerpanjanganModalProps) {
  const {
    statusPerpanjanganOptions,
    statusAtasanOptions,
    statusKaryawanOptions,
    statusPerpanjangan,
    setStatusPerpanjangan,
    statusAtasan,
    setStatusAtasan,
    statusKaryawan,
    setStatusKaryawan,
    catatan,
    setCatatan,
    submitting,
    handleSubmit,
  } = useEditContractRenewalStatusModal({ kontrakData, onClose, onSuccess });

  return (
    <ModalAddEdit
      title="Edit Status Perpanjangan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-4xl"
      content={
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
              <Input type="text" value={kontrakData?.idKaryawan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pengguna</label>
              <Input type="text" value={kontrakData?.pengguna} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posisi</label>
              <Input type="text" value={kontrakData?.posisi} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
              <Input type="text" value={kontrakData?.departemen} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Masuk</label>
              <Input type="text" value={kontrakData?.tanggalMasuk} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Berakhir</label>
              <Input type="text" value={kontrakData?.tanggalBerakhir} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sisa Kontrak</label>
              <Input type="text" value={kontrakData?.sisaKontrak} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Perpanjangan</label>
              <Select
                options={statusPerpanjanganOptions}
                defaultValue={statusPerpanjangan}
                onChange={setStatusPerpanjangan}
                placeholder="Pilih Status Perpanjangan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Atasan</label>
              <Select
                options={statusAtasanOptions}
                defaultValue={statusAtasan}
                onChange={setStatusAtasan}
                placeholder="Pilih Status Atasan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Karyawan</label>
              <Select
                options={statusKaryawanOptions}
                defaultValue={statusKaryawan}
                onChange={setStatusKaryawan}
                placeholder="Pilih Status Karyawan"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
            <TextArea value={catatan} onChange={setCatatan} placeholder="Detail Catatan ..." />
          </div>
        </>
      }
    />
  );
}
