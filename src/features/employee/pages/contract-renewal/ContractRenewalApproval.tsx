import { DataTable } from '../../../structure-and-organize/components/datatable/DataTable';
import { ChevronDown } from 'react-feather';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import EditPengajuanKontrakModal from '@/features/employee/components/modals/employeeData/perpanjanganKontrak/editPengajuanKontrakModal';
import KonfirmasiPenolakanKontrak from '@/features/employee/components/modals/employeeData/perpanjanganKontrak/konfirmasiPenolakanKontrak';
import { useContractRenewalApproval } from '../../hooks/contract-renewal/useContractRenewalApproval';



export default function PersetujuanPerpanjanganKontrak() {
  const {
    data,
    isLoading,
    isDropdownOpen,
    isModalOpen,
    isRejectModalOpen,
    selectedKontrak,
    columns,
    actions,
    setIsDropdownOpen,
    handleModalClose,
    handleRejectModalClose,
    handleRejectSubmit,
    handleNavigateToApproval,
    handleNavigateToExtension,
  } = useContractRenewalApproval();

  return (
    <div className="space-y-6">
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title="Persetujuan Perpanjangan Kontrak"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        filterable={true}
        loading={isLoading}
        emptyMessage="Tidak ada data kontrak"
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Persetujuan Perpanjangan Kontrak
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToExtension}
                >
                  Pengajuan & Kelola Kontrak
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToApproval}
                >
                  Persetujuan Perpanjangan Kontrak
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />
      
      {selectedKontrak && (
        <>
          <EditPengajuanKontrakModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            kontrakData={{
              idKaryawan: selectedKontrak.employee_code,
              pengguna: selectedKontrak.employee_name,
              jenisPerubahan: 'Tidak ada',
              perusahaan: 'Dasaria',
              kantor: 'Head Kantor',
              direktorat: 'SDM',
              divisi: 'HR',
              departemen: selectedKontrak.department_name,
              position: selectedKontrak.position_name || 'HR',
              jabatan: 'EntryLevel',
              golongan: 'D5',
              jenjangJabatan: 'Senior',
              gajiPokok: '4,000,000',
              kategoriKaryawan: 'Staff',
            }}
            onSuccess={() => {
              console.log('Modal closed after success');
            }}
          />
          <KonfirmasiPenolakanKontrak
            isOpen={isRejectModalOpen}
            onClose={handleRejectModalClose}
            idKaryawan={selectedKontrak.employee_code}
            nama={selectedKontrak.employee_name}
            onSubmit={handleRejectSubmit}
          />
        </>
      )}
    </div>
  );
}
