import { DataTable } from '../../../../structure-and-organize/components/datatable/DataTable';
import { ChevronDown } from 'react-feather';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { useContractRenewal } from '../../../hooks/contract-renewal/useContractRenewal';



export default function PerpanjanganKontrak() {
  const {
    data,
    isLoading,
    isDropdownOpen,
    columns,
    actions,
    setIsDropdownOpen,
    handleNavigateToApproval,
    handleNavigateToExtension,
  } = useContractRenewal();

  return (
    <div className="space-y-6">
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title="Perpanjangan Kontrak"
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
              Pengajuan & Kelola Kontrak
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
    </div>
  );
}