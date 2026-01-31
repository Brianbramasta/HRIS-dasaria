import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons/index';
import PermissionsTable, { MenuAccess, Permission, PermissionConfig } from '@/features/role-management-access/components/table/PermissionsTable';

// Default configuration for most menus
const DEFAULT_PERMISSION_CONFIG: PermissionConfig[] = [
  { key: 'lihat', label: 'Lihat' },
  { key: 'edit', label: 'Edit' },
  { key: 'hapus', label: 'Delete' },
  { key: 'buat', label: 'Tambah' },
];

export default function EditRolePage() {
  const { roleId } = useParams<{ roleId: string }>();

  const [namaRole, setNamaRole] = useState(() => {
    if (roleId === '225150207') return 'Super Admin';
    if (roleId === '225150205') return 'HR Admin';
    if (roleId === '225150206') return 'Finance Admin';
    return 'Super Admin';
  });
  const [sistemLayanan, setSistemLayanan] = useState('HRIS');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [menuData, setMenuData] = useState<MenuAccess[]>([
    {
      id: '1',
      namaRole: 'Dashboard',
      hakAkses: 'Dashboard',
      permissions: { lihat: true, buat: false, edit: false, hapus: false },
    },
    {
      id: '2',
      namaRole: 'Struktur Dan Organisasi',
      hakAkses: 'Struktur Dan Organisasi',
      permissions: { lihat: false, buat: false, edit: false, hapus: false },
      subMenus: [
        {
          id: '2-1',
          namaRole: 'Lini Bisnis',
          hakAkses: 'Lini Bisnis',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-2',
          namaRole: 'Perusahaan',
          hakAkses: 'Perusahaan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-3',
          namaRole: 'Kantor',
          hakAkses: 'Kantor',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-4',
          namaRole: 'Direktorat',
          hakAkses: 'Direktorat',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-5',
          namaRole: 'Divisi',
          hakAkses: 'Divisi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-6',
          namaRole: 'Departemen',
          hakAkses: 'Departemen',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-7',
          namaRole: 'Jabatan',
          hakAkses: 'Jabatan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '2-8',
          namaRole: 'Posisi',
          hakAkses: 'Posisi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
      ],
    },
    {
      id: '3',
      namaRole: 'Data Master Karyawan',
      hakAkses: 'Data Master Karyawan',
      permissions: { lihat: false, buat: false, edit: false, hapus: false },
      subMenus: [
        {
          id: '3-1',
          namaRole: 'Data Karyawan',
          hakAkses: 'Data Karyawan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '3-2',
          namaRole: 'Perpanjangan Kontrak',
          hakAkses: 'Perpanjangan Kontrak',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '3-3',
          namaRole: 'Pengunduran Diri',
          hakAkses: 'Pengunduran Diri',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '3-4',
          namaRole: 'Riwayat Organisasi',
          hakAkses: 'Riwayat Organisasi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
      ],
    },
    {
      id: '4',
      namaRole: 'Penggajian',
      hakAkses: 'Penggajian',
      permissions: { lihat: false, buat: false, edit: false, hapus: false },
      subMenus: [
        {
          id: '4-1',
          namaRole: 'Dashboard Penggajian',
          hakAkses: 'Dashboard Penggajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '4-2',
          namaRole: 'Konfigurasi Penggajian',
          hakAkses: 'Konfigurasi Penggajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '4-3',
          namaRole: 'Periode Gajian',
          hakAkses: 'Periode Gajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '4-4',
          namaRole: 'Approval Periode Gajian',
          hakAkses: 'Approval Periode Gajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
          permissionConfig: [
            { key: 'lihat', label: 'Lihat' },
            { key: 'edit', label: 'Edit' },
            { key: 'hapus', label: 'Delete' },
            { key: 'buat', label: 'Tambah' },
            { key: 'persetujuan', label: 'Setujui' },
          ]
        },
        {
          id: '4-5',
          namaRole: 'Distribusi Gaji',
          hakAkses: 'Distribusi Gaji',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
        {
          id: '4-6',
          namaRole: 'Kasbon',
          hakAkses: 'Kasbon',
          permissions: { lihat: false, buat: false, edit: false, hapus: false },
        },
      ],
    },
    {
      id: '5',
      namaRole: 'Hak Akses',
      hakAkses: 'Hak Akses',
      permissions: { lihat: false, buat: false, edit: false, hapus: false },
    },
    {
      id: '6',
      namaRole: 'Jenis Pengajuan',
      hakAkses: 'Jenis Pengajuan',
      permissions: { lihat: false, buat: false, edit: false, hapus: false },
    },
  ]);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePermissionChange = (
    id: string,
    field: string, // Changed from keyof Permission to string
    value: boolean,
    isSubMenu: boolean = false,
    parentId?: string
  ) => {
    setMenuData((prev) =>
      prev.map((item) => {
        // If updating a parent menu
        if (!isSubMenu && item.id === id) {
          const updatedItem = {
            ...item,
            permissions: { ...item.permissions, [field]: value },
          };

          // If parent has submenus, update all children with the same permission
          if (item.subMenus && item.subMenus.length > 0) {
            updatedItem.subMenus = item.subMenus.map((sub) => ({
              ...sub,
              permissions: { ...sub.permissions, [field]: value },
            }));
          }

          return updatedItem;
        }

        // If updating a submenu
        if (isSubMenu && item.id === parentId && item.subMenus) {
          return {
            ...item,
            subMenus: item.subMenus.map((sub) =>
              sub.id === id
                ? { ...sub, permissions: { ...sub.permissions, [field]: value } }
                : sub
            ),
          };
        }

        return item;
      })
    );
  };

  const handleSelectAllRow = (id: string, value: boolean, keys: string[], isSubMenu: boolean = false, parentId?: string) => {
    // Dynamically create permissions object based on ALL keys passed (which come from config)
    // Only update keys that are present in the config for that row
    const permissionsUpdate: Permission = {};
    keys.forEach(key => {
      permissionsUpdate[key] = value;
    });

    setMenuData((prev) =>
      prev.map((item) => {
        if (!isSubMenu && item.id === id) {
          const updatedItem = {
            ...item,
            permissions: { ...item.permissions, ...permissionsUpdate },
          };
          if (item.subMenus && item.subMenus.length > 0) {
            // When selecting all for parent, should we imply all children have same config?
            // Or just update common keys? 
            // For now, let's update common keys if children have them. 
            // However, children might have different configs.
            // The prompt implies per-menu config. Be careful here.
            // If parent has specific config, applying it to children might be wrong if children don't support those keys.
            // BUT typically in this app structure, children inherit standard CRUD.
            // Safest is to update 'permissionsUpdate' keys for children as well, assuming they are compatible or handled.
            updatedItem.subMenus = item.subMenus.map((sub) => ({
              ...sub,
              permissions: { ...sub.permissions, ...permissionsUpdate },
            }));
          }
          return updatedItem;
        }

        if (isSubMenu && item.id === parentId && item.subMenus) {
          return {
            ...item,
            subMenus: item.subMenus.map((sub) =>
              sub.id === id
                ? { ...sub, permissions: { ...sub.permissions, ...permissionsUpdate } }
                : sub
            ),
          };
        }

        return item;
      })
    );
  };

  const handleTutup = () => {
    window.history.back();
  };

  const handleSimpan = () => {
    console.log('Save role data:', { namaRole, sistemLayanan, menuData });
    // Implement save logic here
  };

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
