import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuAccess, Permission, PermissionConfig } from '../components/table/PermissionsTable';
// uuid import removed
// Since I cannot guarantee uuid is installed, I will use a simple generator

const generateId = () => Math.random().toString(36).substr(2, 9);

// Default configuration for most menus
export const DEFAULT_PERMISSION_CONFIG: PermissionConfig[] = [
    { key: 'lihat', label: 'Lihat' },
    { key: 'edit', label: 'Edit' },
    { key: 'hapus', label: 'Delete' },
    { key: 'buat', label: 'Tambah' },
];

export const getInitialMenuData = (): MenuAccess[] => [
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
];

export interface ServiceBlock {
    id: string;
    serviceName: string;
    menuData: MenuAccess[];
    expandedRows: Set<string>;
}

export default function useEditRole() {
    const { roleId } = useParams<{ roleId: string }>();

    const [namaRole, setNamaRole] = useState(() => {
        if (!roleId) return '';
        if (roleId === '225150207') return 'Super Admin';
        if (roleId === '225150205') return 'HR Admin';
        if (roleId === '225150206') return 'Finance Admin';
        return 'Super Admin';
    });

    // Initialize with one empty block
    const [serviceBlocks, setServiceBlocks] = useState<ServiceBlock[]>([
        {
            id: generateId(),
            serviceName: '', // Default empty as per requirement
            menuData: getInitialMenuData(),
            expandedRows: new Set(),
        }
    ]);

    const addServiceBlock = () => {
        setServiceBlocks(prev => [
            ...prev,
            {
                id: generateId(),
                serviceName: '',
                menuData: getInitialMenuData(),
                expandedRows: new Set(),
            }
        ]);
    };

    const removeServiceBlock = (blockId: string) => {
        setServiceBlocks(prev => prev.filter(b => b.id !== blockId));
    };

    const updateServiceBlockName = (blockId: string, name: string) => {
        setServiceBlocks(prev => prev.map(block =>
            block.id === blockId ? { ...block, serviceName: name } : block
        ));
    };

    const toggleExpand = (blockId: string, rowId: string) => {
        setServiceBlocks(prev => prev.map(block => {
            if (block.id !== blockId) return block;

            const newSet = new Set(block.expandedRows);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return { ...block, expandedRows: newSet };
        }));
    };

    const handlePermissionChange = (
        blockId: string,
        id: string,
        field: string,
        value: boolean,
        isSubMenu: boolean = false,
        parentId?: string
    ) => {
        setServiceBlocks(prev => prev.map(block => {
            if (block.id !== blockId) return block;

            const newMenuData = block.menuData.map((item) => {
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
            });

            return { ...block, menuData: newMenuData };
        }));
    };

    const handleSelectAllRow = (
        blockId: string,
        id: string,
        value: boolean,
        keys: string[],
        isSubMenu: boolean = false,
        parentId?: string
    ) => {
        const permissionsUpdate: Permission = {};
        keys.forEach(key => {
            permissionsUpdate[key] = value;
        });

        setServiceBlocks(prev => prev.map(block => {
            if (block.id !== blockId) return block;

            const newMenuData = block.menuData.map((item) => {
                if (!isSubMenu && item.id === id) {
                    const updatedItem = {
                        ...item,
                        permissions: { ...item.permissions, ...permissionsUpdate },
                    };
                    if (item.subMenus && item.subMenus.length > 0) {
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
            });

            return { ...block, menuData: newMenuData };
        }));
    };

    const handleTutup = () => {
        window.history.back();
    };

    const handleSimpan = () => {
        console.log('Save role data:', { namaRole, serviceBlocks });
        // Implement save logic here
    };

    return {
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
        isEditMode: !!roleId
    };
}
