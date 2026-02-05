import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import ContractRenewalDetail from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/ContractRenewalDetail';
import OldContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/OldContract';
import NewContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/NewContract';
import useEditContractRenewalStatusModal from '@/features/employee/hooks/modals/employee-data/contract-renewal/useEditContractRenewalStatusModal';
import { useState, useEffect } from 'react';

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
    submitting,
    handleSubmit,
  } = useEditContractRenewalStatusModal({ kontrakData, onClose, onSuccess });

  const [contractRenewalData, setContractRenewalData] = useState<any>(null);
  const [oldContractData, setOldContractData] = useState<any>(null);
  const [newContractData, setNewContractData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && kontrakData) {
      // Map contract renewal data
      setContractRenewalData({
        employee_id: kontrakData.idKaryawan,
        full_name: kontrakData.pengguna,
        position_name: kontrakData.posisi,
        department_name: kontrakData.departemen,
        join_date: kontrakData.tanggalMasuk,
        end_date: kontrakData.tanggalBerakhir,
        remaining_contract: kontrakData.sisaKontrak,
        renewal_status_name: kontrakData.statusPerpanjangan,
        notes: kontrakData.catatan,
      });

      // Initialize old and new contract data (can be extended based on actual data structure)
      setOldContractData({
        employee_category_name: kontrakData.pengguna,
        company_name: '',
        office_name: '',
        directorate_name: '',
        division_name: '',
        department_name: kontrakData.departemen,
        unit_name: '',
        position_name: kontrakData.posisi,
        job_title_name: '',
        structural_position_name: '',
        position_level_name: '',
        grade: '',
        basic_salary: 0,
      });

      setNewContractData({
        new_change_type_name: '',
        new_employee_category_name: '',
        new_company_name: '',
        new_office_name: '',
        new_directorate_name: '',
        new_division_name: '',
        new_department_name: '',
        new_unit_name: '',
        new_position_name: '',
        new_job_title_name: '',
        new_structural_position_name: '',
        new_position_level_name: '',
        new_grade: '',
        new_basic_salary: 0,
      });
    }
  }, [isOpen, kontrakData]);

  const handleContractRenewalChange = (field: string, value: any) => {
    setContractRenewalData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOldContractChange = (field: string, value: any) => {
    setOldContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewContractChange = (field: string, value: any) => {
    setNewContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ModalAddEdit
      title="Edit Status Perpanjangan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-6xl"
      content={
        <div className="space-y-6">
          {/* Contract Renewal Detail Section */}
            <ContractRenewalDetail
              data={contractRenewalData}
              isEditing={false}
              onChange={handleContractRenewalChange}
            />

          {/* Old Contract Section */}
            <OldContract
              data={oldContractData}
              isEditing={false}
              onChange={handleOldContractChange}
            />

          {/* New Contract Section */}
            <NewContract
              data={newContractData}
              isEditing={true}
              onChange={handleNewContractChange}
            />
        </div>
      }
    />
  );
}
