import { ChevronLeft } from 'react-feather';
import {  useEffect, useMemo } from 'react';
import ContractRenewalDetail from '@/features/employee/components/contract-renewal/ContractRenewalDetail';
import OldContract from '@/features/employee/components/contract-renewal/OldContract';
import NewContract from '@/features/employee/components/contract-renewal/NewContract';
import EditStatusPerpanjanganModal from '@/features/employee/components/modals/employee-data/contract-renewal/EditContractRenewalStatusModal';
// import EditPengajuanKontrakModal from '@/features/employee/components/modals/employee-data/contract-renewal/EditContractRequestModal';
import Button from '@/components/ui/button/Button';
import { useEditContractRenewal } from '../../../../hooks/contract-renewal/useEditContractRenewal';
import { useContractRenewalStore } from '../../../../stores/useContractRenewalStore';
import { useApiContractExtension } from '../../../../hooks/api/useApiContractExtension';



export default function PerpanjangKontrakEdit() {
  const {
    id,
    kontrakData,
    // isLoading,
    isStatusModalOpen,
    // isPengajuanModalOpen,
    setIsStatusModalOpen,
    // setIsPengajuanModalOpen,
    handleGoBack,
    handleUpdateStatus,
    // handleUpdatePengajuan,
    fetchContractRenewalDetail,
    extensionStatusOptions,
  } = useEditContractRenewal();

  const { processContractExtension } = useApiContractExtension();

  const {
    setChangeTypeName,
    shouldShowAllComponents,
    shouldShowDetailAndOldContract,
  } = useContractRenewalStore();

  // Update store when kontrakData changes
  useEffect(() => {
    if (kontrakData?.extension_status) {
      setChangeTypeName(kontrakData.extension_status);
    }
  }, [kontrakData, setChangeTypeName]);

  const handleEditClick = () => {
    setIsStatusModalOpen(true);
  };

  const handleProcessContract = async () => {
    if (!id) return;
    
    const success = await processContractExtension(id);
    if (success) {
      await fetchContractRenewalDetail();
    }
  };

  // Map data for ContractRenewalDetail
  const statusPerpanjanganData = useMemo(() => kontrakData ? {
    employee_id: kontrakData.employee_id,
    full_name: kontrakData.employee_name,
    position_name: kontrakData.current_position,
    department_name: kontrakData.current_department,
    join_date: kontrakData.start_date,
    end_date: kontrakData.end_date,
    remaining_contract: String(kontrakData.remaining_contract),
    renewal_status_name: kontrakData.extension_status,
    contract_type_name: kontrakData.contract_type,
    contract_sequence: String(kontrakData.contract_sequence),
    new_contract_date: kontrakData.new_contract_signed_date || undefined,
    new_contract_end_date: kontrakData.new_contract_end_date || undefined,
    contract_document: kontrakData.contract_document || undefined,
    evaluation_document: kontrakData.evaluation_document || undefined,
    notes: kontrakData.note || undefined,
  } : undefined, [kontrakData]);

  // Map data for OldContract (using previous_position)
  const oldContractData = useMemo(() => kontrakData?.previous_position ? {
    change_type_name: undefined,
    company_name: kontrakData.previous_position.company,
    office_name: kontrakData.previous_position.office,
    directorate_name: kontrakData.previous_position.directorate,
    division_name: kontrakData.previous_position.division,
    department_name: kontrakData.previous_position.department,
    unit_name: kontrakData.previous_position.unit || undefined,
    position_name: kontrakData.previous_position.position,
    job_title_name: kontrakData.previous_position.rank_position,
    structural_position_name: kontrakData.previous_position.structural_position,
    position_level_name: kontrakData.previous_position.position_level,
    grade: kontrakData.previous_position.grade,
    basic_salary: kontrakData.previous_position.salary || undefined,
    employee_category_name: kontrakData.previous_position.employee_category,
    old_contract_document: undefined,
  } : undefined, [kontrakData]);

  // Map data for NewContract (using new_position)
  const newContractData = useMemo(() => kontrakData?.new_position ? {
    new_change_type_name: kontrakData.new_position.change_type,
    new_employee_category_name: kontrakData.new_position.employee_category,
    new_company_name: kontrakData.new_position.company,
    new_office_name: kontrakData.new_position.office,
    new_directorate_name: kontrakData.new_position.directorate,
    new_division_name: kontrakData.new_position.division,
    new_department_name: kontrakData.new_position.department,
    new_unit_name: kontrakData.new_position.unit || undefined,
    new_position_name: kontrakData.new_position.position,
    new_job_title_name: kontrakData.new_position.rank_position,
    new_structural_position_name: kontrakData.new_position.structural_position,
    new_position_level_name: kontrakData.new_position.position_level,
    new_grade: kontrakData.new_position.grade,
    new_basic_salary: kontrakData.new_position.salary || undefined,
    new_contract_document: kontrakData.contract_document || undefined,
  } : undefined, [kontrakData]);

  // Map data for Modals
  const modalData = useMemo(() => kontrakData ? {
    id: id || '',
    idKaryawan: kontrakData.employee_id,
    pengguna: kontrakData.employee_name,
    posisi: kontrakData.current_position,
    departemen: kontrakData.current_department,
    tanggalMasuk: kontrakData.start_date,
    tanggalBerakhir: kontrakData.end_date,
    sisaKontrak: String(kontrakData.remaining_contract),
    statusPerpanjangan: kontrakData.extension_status,
    statusPerpanjanganId: kontrakData.extension_status_id,
    statusAtasan: '',
    statusKaryawan: '',
    catatan: kontrakData.note || '',
    
    // For Pengajuan Modal
    jenisPerubahan: kontrakData.new_position?.change_type || '',
    jenisPerubahanId: kontrakData.new_position?.change_type_id,
    perusahaan: kontrakData.new_position?.company || '',
    perusahaanId: kontrakData.new_position?.company_id,
    kantor: kontrakData.new_position?.office || '',
    kantorId: kontrakData.new_position?.office_id,
    direktorat: kontrakData.new_position?.directorate || '',
    direktoratId: kontrakData.new_position?.directorate_id,
    divisi: kontrakData.new_position?.division || '',
    divisiId: kontrakData.new_position?.division_id,
    // departemen already mapped, but need ID for new position
    departemenBaru: kontrakData.new_position?.department || '',
    departemenBaruId: kontrakData.new_position?.department_id,
    position: kontrakData.new_position?.position || '',
    positionId: kontrakData.new_position?.position_id,
    jabatan: kontrakData.new_position?.rank_position || '',
    jabatanId: kontrakData.new_position?.rank_position_id, // Assuming rank_position maps to job_title
    structuralPositionId: kontrakData.new_position?.structural_position_id,
    golongan: kontrakData.new_position?.grade || '',
    jenjangJabatan: kontrakData.new_position?.position_level || '',
    jenjangJabatanId: kontrakData.new_position?.position_level_id,
    gajiPokok: String(kontrakData.new_position?.salary || ''),
    kategoriKaryawan: kontrakData.new_position?.employee_category || '',
    kategoriKaryawanId: kontrakData.new_position?.employee_category_id,
    unitId: kontrakData.new_position?.unit_id,
  } : undefined, [kontrakData]);

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

      {/* Combined Card: Status Perpanjangan, Kontrak Lama, dan Kontrak Baru */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
       

        {/* Card Content */}
        <div className="px-6 pb-8 space-y-8">
          {/* Section 1: Status Perpanjangan - Always Show */}
          <div>
            <ContractRenewalDetail
              data={statusPerpanjanganData}
              isEditing={false}
            />
          </div>

          {/* Section 2 & 3: Kontrak Lama dan Kontrak Baru - Conditional Rendering */}
          {shouldShowAllComponents() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <OldContract
                  data={oldContractData}
                  isEditing={false}
                  kategoriKaryawanOptions={[]}
                />
              </div>

              <div>
                <NewContract
                  data={newContractData}
                  isEditing={true}
                  kategoriKaryawanOptions={[]}
                />
              </div>
            </div>
          )}

          {shouldShowDetailAndOldContract() && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <OldContract
                  data={oldContractData}
                  isEditing={false}
                />
              </div>
            </div>
          )}

          {/* Edit Button - Only show when status is "Menunggu diproses" or "Sedang di Proses" */}
          {kontrakData?.extension_status && (
            < div className='flex justify-end gap-4'>
             <div className="flex justify-end pt-4 ">
              {kontrakData.extension_status === "Menunggu diproses" ? (
                <Button
                  onClick={handleProcessContract}
                  variant="custom"
                  className='border'
                  size="sm"
                >
                  Di proses
                </Button>
               ) : null}
            </div>
            <div className="flex justify-end pt-4 ">
              {kontrakData.extension_status === "Menunggu diproses" || kontrakData.extension_status === "Sedang diproses" ? (
                <Button
                  onClick={handleEditClick}
                  variant="primary"
                  size="sm"
                >
                  Edit
                </Button>
              ) : null} 
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Edit Status Perpanjangan */}
      <EditStatusPerpanjanganModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        kontrakData={modalData}
        onSuccess={fetchContractRenewalDetail}
        onSubmit={handleUpdateStatus}
        statusOptions={extensionStatusOptions}
      />

      {/* Modal: Edit Pengajuan Kontrak */}
      {/* <EditPengajuanKontrakModal
        isOpen={isPengajuanModalOpen}
        onClose={() => setIsPengajuanModalOpen(false)}
        kontrakData={modalData}
        onSuccess={fetchContractRenewalDetail}
        onSubmit={handleUpdatePengajuan}
      /> */}
    </div>
  );
}
