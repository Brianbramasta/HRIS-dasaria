import React from 'react';
import Checkbox from '@/components/form/input/Checkbox';
import { ChevronDownIcon, ChevronUpIcon, CalenderIcon } from '@/icons/index';
import { IconPenggajian, IconKaryawan, IconStrukturOrganisasi, IconHakAksesMenu, IconJenisPengajuan } from '@/icons/components/icons';

export type Permission = Record<string, boolean>;

export interface PermissionConfig {
    key: string;
    label: string;
}

export interface MenuAccess {
    id: string;
    namaRole: string;
    hakAkses: string;
    permissions: Permission;
    permissionConfig?: PermissionConfig[];
    subMenus?: MenuAccess[];
}

interface PermissionsTableProps {
    menuData: MenuAccess[];
    expandedRows: Set<string>;
    toggleExpand: (id: string) => void;
    handleSelectAllRow: (id: string, value: boolean, keys: string[], isSubMenu?: boolean, parentId?: string) => void;
    handlePermissionChange: (
        id: string,
        field: string,
        value: boolean,
        isSubMenu?: boolean,
        parentId?: string
    ) => void;
    defaultPermissionConfig: PermissionConfig[];
}

const PermissionsTable: React.FC<PermissionsTableProps> = ({
    menuData,
    expandedRows,
    toggleExpand,
    handleSelectAllRow,
    handlePermissionChange,
    defaultPermissionConfig,
}) => {
    const getMenuIcon = (menuName: string) => {
        const color = '#004969';
        switch (menuName) {
            case 'Dashboard':
                return <CalenderIcon className="h-5 w-5 text-[#004969]" />;
            case 'Struktur Dan Organisasi':
                return IconStrukturOrganisasi({ size: 20, color });
            case 'Data Master Karyawan':
                return IconKaryawan({ size: 20, color });
            case 'Penggajian':
                return IconPenggajian({ size: 20, color });
            case 'Hak Akses':
                return IconHakAksesMenu({ size: 20, color });
            case 'Jenis Pengajuan':
                return IconJenisPengajuan({ size: 20, color });
            default:
                return null;
        }
    };

    const rows: React.ReactElement[] = [];

    menuData.forEach((menu) => {
        const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;
        const isExpanded = expandedRows.has(menu.id);
        const currentConfig = menu.permissionConfig || defaultPermissionConfig;
        const currentKeys = currentConfig.map(c => c.key);

        // Determine if "Semua" is checked for the parent
        const isAllChecked = currentConfig.every(config => menu.permissions[config.key] === true);

        rows.push(
            <div key={menu.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(menu.id)}>
                    <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-white">
                        {getMenuIcon(menu.namaRole)}
                        <span className="text-sm md:text-base text-[#004969] dark:text-blue-400">{menu.namaRole}</span>
                    </div>
                    <div className="text-gray-500">
                        {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                    </div>
                </div>

                {isExpanded && (
                    <div className="bg-white dark:bg-gray-900 pb-2">
                        {!hasSubMenus ? (
                            // Parent row content if no submenus
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4 py-3 items-center bg-gray-50/50 dark:bg-gray-800/30 rounded-lg mx-4 mb-2">
                                <div className="font-medium text-sm text-gray-700 dark:text-gray-300 md:col-span-1">{menu.namaRole}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-start">
                                    <Checkbox checked={isAllChecked} onChange={(val) => handleSelectAllRow(menu.id, val, currentKeys)} />
                                    <span>Semua</span>
                                </div>
                                {currentConfig.map((config) => (
                                    <div key={config.key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-start">
                                        <Checkbox
                                            checked={!!menu.permissions[config.key]}
                                            onChange={(val) => handlePermissionChange(menu.id, config.key, val)}
                                        />
                                        <span>{config.label}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Submenus
                            menu.subMenus!.map((subMenu) => {
                                const subMenuConfig = subMenu.permissionConfig || defaultPermissionConfig;
                                const subMenuKeys = subMenuConfig.map(c => c.key);
                                const isSubAllChecked = subMenuConfig.every(config => subMenu.permissions[config.key] === true);

                                return (
                                    <div key={subMenu.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4 py-3 items-center border-t border-gray-100 dark:border-gray-800 mx-4">
                                        <div className="font-medium text-sm text-gray-700 dark:text-gray-300 md:col-span-1 pl-4">{subMenu.namaRole}</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-start">
                                            <Checkbox checked={isSubAllChecked} onChange={(val) => handleSelectAllRow(subMenu.id, val, subMenuKeys, true, menu.id)} />
                                            <span>Semua</span>
                                        </div>
                                        {subMenuConfig.map((config) => (
                                            <div key={config.key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-start">
                                                <Checkbox
                                                    checked={!!subMenu.permissions[config.key]}
                                                    onChange={(val) => handlePermissionChange(subMenu.id, config.key, val, true, menu.id)}
                                                />
                                                <span>{config.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        );
    });

    return <>{rows}</>;
};

export default PermissionsTable;
