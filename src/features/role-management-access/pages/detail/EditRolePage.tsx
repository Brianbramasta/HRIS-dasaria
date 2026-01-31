import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons/index';
import PermissionsTable from '@/features/role-management-access/components/table/PermissionsTable';
import useEditRole, { DEFAULT_PERMISSION_CONFIG } from '@/features/role-management-access/hooks/useEditRole';

export default function EditRolePage() {
  const {
    namaRole,
    setNamaRole,
    sistemLayanan,
    setSistemLayanan,
    menuData,
    expandedRows,
    toggleExpand,
    handlePermissionChange,
    handleSelectAllRow,
    handleTutup,
    handleSimpan
  } = useEditRole();

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Role</h1>

        <div className="space-y-6 mb-8">
          <InputField
            label="Nama Role"
            type="text"
            value={namaRole}
            onChange={(e) => setNamaRole(e.target.value)}
            placeholder="Masukkan Nama Role"
          />

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <SelectField
                label="Sistem Layanan"
                options={[{ label: 'HRIS', value: 'HRIS' }]}
                defaultValue={sistemLayanan}
                onChange={(val) => setSistemLayanan(val)}
                placeholder="Pilih Sistem Layanan"
              />
            </div>
            <button
              className="mb-[2px] p-[10px] rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <PermissionsTable
            menuData={menuData}
            expandedRows={expandedRows}
            toggleExpand={toggleExpand}
            handleSelectAllRow={handleSelectAllRow}
            handlePermissionChange={handlePermissionChange}
            defaultPermissionConfig={DEFAULT_PERMISSION_CONFIG}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" onClick={handleTutup} className="px-6">
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSimpan} className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
