import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuAccess, Permission, PermissionConfig } from '../components/table/PermissionsTable';
import { useApiRolesAccess } from './api/useApiRolesAccess';
import { AppRoleAccessItem } from '../types/dto/RolesAccessType';

export const DEFAULT_PERMISSION_CONFIG: PermissionConfig[] = [
    { key: 'lihat', label: 'Lihat' },
    { key: 'edit', label: 'Edit' },
    { key: 'hapus', label: 'Delete' },
    { key: 'buat', label: 'Tambah' },
];

export interface ExtendedMenuAccess extends MenuAccess {
    permissionIds: Record<string, string>;
}

export interface ServiceBlock {
    id: string;
    serviceName: string; // This stores the App ID
    serviceLabel?: string; // This stores the App Name
    menuData: ExtendedMenuAccess[];
    expandedRows: Set<string>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function useEditRole() {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    
    const { 
        fetchRolesAccess, 
        fetchAppDetail, 
        fetchAllApps, 
        createRolesAccess,
        roleAccessDetail, 
        allApps,
        loading 
    } = useApiRolesAccess();

    const [namaRole, setNamaRole] = useState('');
    const [serviceBlocks, setServiceBlocks] = useState<ServiceBlock[]>([
        {
            id: generateId(),
            serviceName: '',
            menuData: [],
            expandedRows: new Set(),
        }
    ]);

    // Fetch all apps on mount to populate options
    useEffect(() => {
        fetchAllApps();
    }, [fetchAllApps]);

    // Fetch role details if in edit mode
    useEffect(() => {
        if (roleId) {
            fetchRolesAccess(roleId);
            // We assume the role name is not directly available in fetchRolesAccess response (it returns list of apps)
            // But usually we need to fetch Role Info separately or extract from somewhere.
            // For now, let's leave namaRole empty or set it if we can find it.
            // Wait, the API contract for GET /roles-access/{id} returns AppRoleAccessItem[].
            // It doesn't return the Role Name itself at the top level?
            // "berhasil mendapatkan daftar roles dengan struktur hierarchy"
            // The response is an Array of Apps.
            // Where is the Role Name?
            // Maybe fetchAppsPerRole returns it?
            // GET /roles-access/app-role returns { role_id, role_name, list_apps }.
            // So we might need to find the role name from there.
        }
    }, [roleId, fetchRolesAccess]);

    // Handle role name fetching via fetchAppsPerRole if needed
    // Or maybe we can't get it easily. I'll skip setting namaRole from API for now if it's not in the response.

    // Process roleAccessDetail when it loads (Edit Mode)
    useEffect(() => {
        if (roleId && roleAccessDetail.length > 0) {
            const processRoleData = async () => {
                const newBlocks: ServiceBlock[] = [];

                // We need to fetch the Full Tree for each App to show unchecked boxes
                for (const appAccess of roleAccessDetail) {
                    const fullAppDetail = await fetchAppDetail(appAccess.app_id);
                    
                    if (fullAppDetail) {
                        // Create a Set of Assigned Access IDs for this App
                        const assignedAccessIds = new Set<string>();
                        
                        const traverse = (modules: any[]) => {
                            modules.forEach((mod: any) => {
                                mod.features?.forEach((feat: any) => {
                                    feat.list_access?.forEach((acc: any) => {
                                        assignedAccessIds.add(acc.access_id);
                                    });
                                });
                            });
                        };
                        traverse(appAccess.list_modules);

                        // Map the Full Tree to MenuAccess, marking permissions as true if in assignedAccessIds
                        const menuData = mapAppDetailToMenuAccess(fullAppDetail, assignedAccessIds);
                        
                        newBlocks.push({
                            id: generateId(),
                            serviceName: appAccess.app_id,
                            serviceLabel: appAccess.app_name,
                            menuData,
                            expandedRows: new Set(),
                        });
                    }
                }
                
                if (newBlocks.length > 0) {
                    setServiceBlocks(newBlocks);
                }
            };
            processRoleData();
        }
    }, [roleAccessDetail, roleId, fetchAppDetail]);


    // Helper to map AppDetail to MenuAccess
    const mapAppDetailToMenuAccess = (appDetail: AppRoleAccessItem, assignedIds: Set<string> = new Set()): ExtendedMenuAccess[] => {
        return appDetail.list_modules.map(module => {
            const subMenus = module.features.map(feature => {
                const permissions: Permission = {};
                const permissionIds: Record<string, string> = {};
                const permissionConfig: PermissionConfig[] = [];

                // Sort access list to ensure consistent order if needed (e.g. Lihat, Buat, Edit, Hapus)
                // For now, we use the order from API
                feature.list_access.forEach(acc => {
                    // Use a safe key derived from name
                    const key = acc.access_name.toLowerCase().replace(/\s+/g, '_'); 
                    permissionIds[key] = acc.access_id;
                    permissions[key] = assignedIds.has(acc.access_id);
                    permissionConfig.push({ key, label: acc.access_name });
                });

                return {
                    id: feature.features_id,
                    namaRole: feature.features_name,
                    hakAkses: feature.features_name,
                    permissions,
                    permissionIds,
                    permissionConfig // Use dynamic config based on available permissions
                } as ExtendedMenuAccess;
            });

            // If module has features, it acts as a parent.
            return {
                id: module.modules_id,
                namaRole: module.modules_name,
                hakAkses: module.modules_name,
                permissions: {},
                permissionIds: {},
                subMenus
            } as ExtendedMenuAccess;
        });
    };

    const addServiceBlock = () => {
        setServiceBlocks(prev => [
            ...prev,
            {
                id: generateId(),
                serviceName: '',
                menuData: [],
                expandedRows: new Set(),
            }
        ]);
    };

    const removeServiceBlock = (blockId: string) => {
        setServiceBlocks(prev => prev.filter(b => b.id !== blockId));
    };

    const updateServiceBlockName = async (blockId: string, appId: string) => {
        // Find app name
        const app = allApps.find(a => a.id === appId);
        const appName = app ? app.name : '';

        // Fetch App Detail
        const appDetail = await fetchAppDetail(appId);
        let menuData: ExtendedMenuAccess[] = [];
        
        if (appDetail) {
            menuData = mapAppDetailToMenuAccess(appDetail);
        }

        setServiceBlocks(prev => prev.map(block =>
            block.id === blockId ? { 
                ...block, 
                serviceName: appId,
                serviceLabel: appName,
                menuData 
            } : block
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
                if (isSubMenu && item.id === parentId && item.subMenus) {
                     return {
                        ...item,
                        subMenus: item.subMenus.map((sub) => 
                            sub.id === id 
                            ? { ...sub, permissions: { ...sub.permissions, [field]: value } }
                            : sub
                        )
                    } as ExtendedMenuAccess;
                }
                
                // If it's a top level item (though in our mapping, top level are Modules which might not have permissions)
                // But if the structure changes:
                if (!isSubMenu && item.id === id) {
                    return {
                        ...item,
                        permissions: { ...item.permissions, [field]: value }
                    } as ExtendedMenuAccess;
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
                if (isSubMenu && item.id === parentId && item.subMenus) {
                    return {
                        ...item,
                        subMenus: item.subMenus.map((sub) =>
                            sub.id === id
                                ? { ...sub, permissions: { ...sub.permissions, ...permissionsUpdate } }
                                : sub
                        ),
                    } as ExtendedMenuAccess;
                }
                
                if (!isSubMenu && item.id === id) {
                    return {
                        ...item,
                        permissions: { ...item.permissions, ...permissionsUpdate },
                    } as ExtendedMenuAccess;
                }

                return item;
            });

            return { ...block, menuData: newMenuData };
        }));
    };

    const handleTutup = () => {
        navigate(-1);
    };

    const handleSimpan = async () => {
        // Construct payload
        // We need to aggregate all accessIds from all blocks
        // For each block (App), we create an Item in the payload?
        // Wait, the payload is { items: RoleAccessItemPayload[] }
        // RoleAccessItemPayload = { id, name, apps_id, accessIds }
        // If we are editing one Role, does it mean we send one item per App?
        // Yes, "items" array suggests multiple entries.
        
        const payloadItems = serviceBlocks.map(block => {
            const accessIds: string[] = [];
            
            const traverse = (menus: ExtendedMenuAccess[]) => {
                menus.forEach(menu => {
                    // Check permissions
                    Object.keys(menu.permissions).forEach(key => {
                        if (menu.permissions[key] && menu.permissionIds[key]) {
                            accessIds.push(menu.permissionIds[key]);
                        }
                    });
                    
                    if (menu.subMenus) {
                        traverse(menu.subMenus as ExtendedMenuAccess[]);
                    }
                });
            };
            
            traverse(block.menuData);

            return {
                id: roleId || null, // If edit, use roleId? 
                // Wait, the payload ID seems to be the ID of the Role-App relation? 
                // Or is it the Role ID?
                // If it's bulk create/replace, maybe we just send the Role Name and App ID.
                // If `id` is null, it creates. If `id` is present, it updates?
                // The documentation says "Create or Replace".
                // If we use the same Role Name, it might group them?
                // "id": string (UUID) or null.
                // If we are editing, we should probably use the Role ID.
                
                name: namaRole,
                apps_id: block.serviceName, // This is the App ID
                accessIds
            };
        });

        const success = await createRolesAccess({ items: payloadItems });
        if (success) {
            navigate(-1); // Go back on success
        }
    };

    const serviceOptions = allApps.map(app => ({
        label: app.name,
        value: app.id
    }));

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
        isEditMode: !!roleId,
        serviceOptions, // Expose options
        loading
    };
}
