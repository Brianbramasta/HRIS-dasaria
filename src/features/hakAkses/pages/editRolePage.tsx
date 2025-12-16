import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import InputField from '@/components/form/input/InputField';
import Checkbox from '@/components/form/input/Checkbox';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon, ChevronUpIcon, CalenderIcon } from '@/icons/index';
import { iconPenggajian, iconKaryawan, iconStrukturOrganisasi, IconHakAksesMenu, IconJenisPengajuan } from '@/icons/components/icons';

interface Permission {
  lihat: boolean;
  buat: boolean;
  edit: boolean;
  hapus: boolean;
  persetujuan: boolean;
}

interface MenuAccess {
  id: string;
  namaRole: string;
  hakAkses: string;
  permissions: Permission;
  subMenus?: MenuAccess[];
}

export default function EditRolePage() {
  const { roleId } = useParams<{ roleId: string }>();
  
  // Initialize role data based on roleId
  const [idRole, setIdRole] = useState(roleId || '225150207');
  const [namaRole, setNamaRole] = useState(() => {
    // Set nama role based on roleId
    if (roleId === '225150207') return 'Super Admin';
    if (roleId === '225150205') return 'HR Admin';
    if (roleId === '225150206') return 'Finance Admin';
    return 'Super Admin';
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const [menuData, setMenuData] = useState<MenuAccess[]>([
    {
      id: '1',
      namaRole: 'Dashboard',
      hakAkses: 'Dashboard',
      permissions: { lihat: true, buat: false, edit: false, hapus: false, persetujuan: false },
    },
    {
      id: '2',
      namaRole: 'Struktur Dan Organisasi',
      hakAkses: 'Struktur Dan Organisasi',
      permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
      subMenus: [
        {
          id: '2-1',
          namaRole: 'Lini Bisnis',
          hakAkses: 'Lini Bisnis',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-2',
          namaRole: 'Perusahaan',
          hakAkses: 'Perusahaan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-3',
          namaRole: 'Kantor',
          hakAkses: 'Kantor',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-4',
          namaRole: 'Direktorat',
          hakAkses: 'Direktorat',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-5',
          namaRole: 'Divisi',
          hakAkses: 'Divisi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-6',
          namaRole: 'Departemen',
          hakAkses: 'Departemen',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-7',
          namaRole: 'Jabatan',
          hakAkses: 'Jabatan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '2-8',
          namaRole: 'Posisi',
          hakAkses: 'Posisi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
      ],
    },
    {
      id: '3',
      namaRole: 'Data Master Karyawan',
      hakAkses: 'Data Master Karyawan',
      permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
      subMenus: [
        {
          id: '3-1',
          namaRole: 'Data Karyawan',
          hakAkses: 'Data Karyawan',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '3-2',
          namaRole: 'Perpanjangan Kontrak',
          hakAkses: 'Perpanjangan Kontrak',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '3-3',
          namaRole: 'Pengunduran Diri',
          hakAkses: 'Pengunduran Diri',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '3-4',
          namaRole: 'Riwayat Organisasi',
          hakAkses: 'Riwayat Organisasi',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
      ],
    },
    {
      id: '4',
      namaRole: 'Penggajian',
      hakAkses: 'Penggajian',
      permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
      subMenus: [
        {
          id: '4-1',
          namaRole: 'Dashboard Penggajian',
          hakAkses: 'Dashboard Penggajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '4-2',
          namaRole: 'Konfigurasi Penggajian',
          hakAkses: 'Konfigurasi Penggajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '4-3',
          namaRole: 'Periode Gajian',
          hakAkses: 'Periode Gajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '4-4',
          namaRole: 'Approval Periode Gajian',
          hakAkses: 'Approval Periode Gajian',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '4-5',
          namaRole: 'Distribusi Gaji',
          hakAkses: 'Distribusi Gaji',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
        {
          id: '4-6',
          namaRole: 'Kasbon',
          hakAkses: 'Kasbon',
          permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
        },
      ],
    },
    {
      id: '5',
      namaRole: 'Hak Akses',
      hakAkses: 'Hak Akses',
      permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
    },
    {
      id: '6',
      namaRole: 'Jenis Pengajuan',
      hakAkses: 'Jenis Pengajuan',
      permissions: { lihat: false, buat: false, edit: false, hapus: false, persetujuan: false },
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
    field: keyof Permission,
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

  const handleTutup = () => {
    window.history.back();
  };

  const handleSimpan = () => {
    console.log('Save role data:', { idRole, namaRole, menuData });
    // Implement save logic here
  };

  // Get menu icon based on menu name
  const getMenuIcon = (menuName: string) => {
    const color = '#6C757D';
    switch (menuName) {
      case 'Dashboard':
        return <CalenderIcon className="h-4 w-4" style={{ color }} />;
      case 'Struktur Dan Organisasi':
        return iconStrukturOrganisasi({ size: 16, color });
      case 'Data Master Karyawan':
        return iconKaryawan({ size: 16, color });
      case 'Penggajian':
        return iconPenggajian({ size: 16, color });
      case 'Hak Akses':
        return IconHakAksesMenu({ size: 16, color });
      case 'Jenis Pengajuan':
        return IconJenisPengajuan({ size: 16, color });
      default:
        return null;
    }
  };

  // Handle select all for a submenu row
  const handleSelectAllSubMenu = (parentId: string, subMenuId: string, value: boolean) => {
    setMenuData((prev) =>
      prev.map((item) => {
        if (item.id === parentId && item.subMenus) {
          return {
            ...item,
            subMenus: item.subMenus.map((sub) =>
              sub.id === subMenuId
                ? {
                    ...sub,
                    permissions: {
                      lihat: value,
                      buat: value,
                      edit: value,
                      hapus: value,
                      persetujuan: value,
                    },
                  }
                : sub
            ),
          };
        }
        return item;
      })
    );
  };

  const renderTableRows = () => {
    const rows: React.ReactElement[] = [];

    menuData.forEach((menu) => {
      const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;
      const isExpanded = expandedRows.has(menu.id);

      rows.push(
        <tr key={menu.id} className="border-b border-gray-100 dark:border-gray-800">
          <td className={`px-6 py-4 text-sm ${hasSubMenus ? 'cursor-pointer' : ''}`} colSpan={hasSubMenus ? 6 : 1} onClick={() => {if (hasSubMenus) toggleExpand(menu.id)}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMenuIcon(menu.namaRole)}
                <span className={hasSubMenus ? 'font-semibold' : ''}>{menu.namaRole}</span>
              </div>
              {hasSubMenus && (
                <button
                  onClick={() => toggleExpand(menu.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isExpanded ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </td>
          {!hasSubMenus && (
            <>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={menu.permissions.lihat}
                  onChange={(value) => handlePermissionChange(menu.id, 'lihat', value)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={menu.permissions.buat}
                  onChange={(value) => handlePermissionChange(menu.id, 'buat', value)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={menu.permissions.edit}
                  onChange={(value) => handlePermissionChange(menu.id, 'edit', value)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={menu.permissions.hapus}
                  onChange={(value) => handlePermissionChange(menu.id, 'hapus', value)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={menu.permissions.persetujuan}
                  onChange={(value) => handlePermissionChange(menu.id, 'persetujuan', value)}
                />
              </td>
            </>
          )}
          {/* {hasSubMenus && (
            <td colSpan={5} className="px-6 py-4 text-sm text-center"></td>
          )} */}
        </tr>
      );

      // Render submenu rows if expanded
      if (isExpanded && hasSubMenus) {
        menu.subMenus!.forEach((subMenu) => {
          const allChecked = Object.values(subMenu.permissions).every((v) => v === true);
          
          rows.push(
            <tr key={subMenu.id} className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-2 pl-10">
                  <Checkbox
                    checked={allChecked}
                    onChange={(value) => handleSelectAllSubMenu(menu.id, subMenu.id, value)}
                  />
                  <span>{subMenu.namaRole}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={subMenu.permissions.lihat}
                  onChange={(value) => handlePermissionChange(subMenu.id, 'lihat', value, true, menu.id)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={subMenu.permissions.buat}
                  onChange={(value) => handlePermissionChange(subMenu.id, 'buat', value, true, menu.id)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={subMenu.permissions.edit}
                  onChange={(value) => handlePermissionChange(subMenu.id, 'edit', value, true, menu.id)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={subMenu.permissions.hapus}
                  onChange={(value) => handlePermissionChange(subMenu.id, 'hapus', value, true, menu.id)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <Checkbox
                  checked={subMenu.permissions.persetujuan}
                  onChange={(value) => handlePermissionChange(subMenu.id, 'persetujuan', value, true, menu.id)}
                />
              </td>
            </tr>
          );
        });
      }
    });

    return rows;
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Role</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Role
            </label>
            <InputField
              type="text"
              value={idRole}
              onChange={(e) => setIdRole(e.target.value)}
              placeholder="Masukkan ID Role"
              readonly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Role
            </label>
            <InputField
              type="text"
              value={namaRole}
              onChange={(e) => setNamaRole(e.target.value)}
              placeholder="Masukkan Nama Role"
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Hak Akses</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#004969] text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Hak Akses
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Lihat
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Buat
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Hapus
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Persetujuan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleTutup}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSimpan}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
