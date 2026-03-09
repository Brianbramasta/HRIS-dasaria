import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import Button from '@/components/ui/button/Button';
import { IconPlus as PlusIcon, IconHapus as TrashIcon } from '@/icons/components/icons'
import PermissionsTable from '@/features/role-management-access/components/table/PermissionsTable';
import useEditRole, { DEFAULT_PERMISSION_CONFIG } from '@/features/role-management-access/hooks/useEditRole';

export default function EditRolePage() {
  const {
    namaRole,
    setNamaRole,
    serviceBlocks,
    addServiceBlock,
    removeServiceBlock,
    updateServiceBlockName,
    toggleExpand,
    handlePermissionChange,
    handleSelectAllRow,
    handleTutup,
    handleSimpan,
    isEditMode,
    serviceOptions,
    loading
  } = useEditRole();

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Role' : 'Tambah Role'}
        </h1>

        <div className="space-y-6 mb-8">
          <InputField
            label="Nama Role"
            type="text"
            value={namaRole}
            onChange={(e) => setNamaRole(e.target.value)}
            placeholder="Masukkan Nama Role"
          />

          {serviceBlocks.map((block, index) => (
            <div key={block.id} className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <SelectField
                    label="Sistem Layanan"
                    options={serviceOptions}
                    defaultValue={block.serviceName}
                    onChange={(val) => updateServiceBlockName(block.id, val)}
                    placeholder="Pilih Sistem Layanan"
                  />
                </div>

                {/* Show Plus button on the first row, or always? 
                    User request: "ketika klik @... pastikan menambahkan baris baru" 
                    The image suggests plus button is on the first row. 
                    Let's keep Plus on the first row, and Trash on subsequent rows. 
                */}
                {index === 0 ? (
                  <button
                    className="mb-[2px] p-[10px] rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                    onClick={addServiceBlock}
                    title="Tambah Sistem Layanan"
                  >
                    <PlusIcon />
                  </button>
                ) : (
                  <button
                    className="mb-[2px] p-[10px] rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                    onClick={() => removeServiceBlock(block.id)}
                    title="Hapus Sistem Layanan"
                  >
                    <TrashIcon color='white' />
                  </button>
                )}
              </div>

              {/* Only show table if a service is selected */}
              {block.serviceName && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mt-4">
                  <PermissionsTable
                    menuData={block.menuData}
                    expandedRows={block.expandedRows}
                    toggleExpand={(rowId) => toggleExpand(block.id, rowId)}
                    handleSelectAllRow={(id, val, keys, isSub, pId) => handleSelectAllRow(block.id, id, val, keys, isSub, pId)}
                    handlePermissionChange={(id, field, val, isSub, pId) => handlePermissionChange(block.id, id, field, val, isSub, pId)}
                    defaultPermissionConfig={DEFAULT_PERMISSION_CONFIG}
                  />
                </div>
              )}
            </div>
          ))}

        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" onClick={handleTutup} className="px-6">
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSimpan} className="px-6 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
