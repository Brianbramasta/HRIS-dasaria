import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RoleData {
  no: number;
  idRole: string;
  role: string;
  sistemLayanan: string;
}

export interface LayananData {
  no: number;
  idLayanan: string;
  sistemLayanan: string;
}

export default function useRoleManagement() {
  const navigate = useNavigate();

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [selectedServiceToDelete, setSelectedServiceToDelete] = useState<LayananData | null>(null);
  const [selectedServiceToEdit, setSelectedServiceToEdit] = useState<LayananData | null>(null);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [selectedRoleToDelete, setSelectedRoleToDelete] = useState<RoleData | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});

  // Data Role Akses
  const [rawRoleData] = useState<RoleData[]>([
    { no: 1, idRole: '225150207', role: 'Super Admin', sistemLayanan: 'HRIS, IAM, ERP, OMB, BMS, Customer Care Chat' },
    { no: 2, idRole: '225150205', role: 'HR Admin', sistemLayanan: 'HRIS' },
    { no: 3, idRole: '225150206', role: 'Finance Admin', sistemLayanan: 'HRIS, IAM' },
    { no: 4, idRole: '225150206', role: 'Staff', sistemLayanan: 'HRIS' },
  ]);

  // Data Sistem Layanan
  const [rawLayananData] = useState<LayananData[]>([
    { no: 1, idLayanan: '225150207', sistemLayanan: 'HRIS' },
    { no: 2, idLayanan: '225150205', sistemLayanan: 'IAM' },
    { no: 3, idLayanan: '225150206', sistemLayanan: 'ERP' },
    { no: 4, idLayanan: '225150206', sistemLayanan: 'OMB' },
    { no: 5, idLayanan: '225150206', sistemLayanan: 'BMS' },
    { no: 6, idLayanan: '225150206', sistemLayanan: 'Customer Chat Care' },
  ]);

  const roleData = useMemo(() => {
    return rawRoleData.filter((row) => {
      // Filter by Sistem Layanan (multi-select)
      const selectedLayanan = columnFilters['sistemLayanan'];
      if (selectedLayanan && selectedLayanan.length > 0) {
        const rowLayanan = row.sistemLayanan.split(',').map((s) => s.trim());
        const matches = selectedLayanan.some((selected) => rowLayanan.includes(selected));
        if (!matches) return false;
      }
      return true;
    });
  }, [rawRoleData, columnFilters]);

  const layananData = useMemo(() => {
    return rawLayananData.filter((row) => {
      // Filter by Sistem Layanan (multi-select)
      const selectedLayanan = columnFilters['sistemLayanan'];
      if (selectedLayanan && selectedLayanan.length > 0) {
        if (!selectedLayanan.includes(row.sistemLayanan)) return false;
      }
      return true;
    });
  }, [rawLayananData, columnFilters]);

  const handleAddRole = useCallback(() => {
    navigate('/role-management-access/add');
  }, [navigate]);

  const handleAddLayanan = useCallback(() => {
    setIsAddServiceModalOpen(true);
  }, []);

  const handleCloseAddServiceModal = useCallback(() => {
    setIsAddServiceModalOpen(false);
  }, []);

  const handleDeleteRole = useCallback((row: RoleData) => {
    setSelectedRoleToDelete(row);
    setIsDeleteRoleModalOpen(true);
  }, []);

  const handleDeleteLayanan = useCallback((row: LayananData) => {
    setSelectedServiceToDelete(row);
    setIsDeleteServiceModalOpen(true);
  }, []);

  const handleCloseDeleteServiceModal = useCallback(() => {
    setIsDeleteServiceModalOpen(false);
    setSelectedServiceToDelete(null);
  }, []);

  const handleConfirmDeleteService = useCallback(() => {
    console.log('Deleting service:', selectedServiceToDelete);
    // TODO: Implement actual delete logic here
    handleCloseDeleteServiceModal();
  }, [selectedServiceToDelete, handleCloseDeleteServiceModal]);

  const handleCloseDeleteRoleModal = useCallback(() => {
    setIsDeleteRoleModalOpen(false);
    setSelectedRoleToDelete(null);
  }, []);

  const handleConfirmDeleteRole = useCallback(() => {
    console.log('Deleting role:', selectedRoleToDelete);
    // TODO: Implement actual delete logic here
    handleCloseDeleteRoleModal();
  }, [selectedRoleToDelete, handleCloseDeleteRoleModal]);

  const handleEditRole = useCallback((row: RoleData) => {
    navigate(`/role-management-access/edit/${row.idRole}`);
  }, [navigate]);

  const handleEditLayanan = useCallback((row: LayananData) => {
    setSelectedServiceToEdit(row);
    setIsEditServiceModalOpen(true);
  }, []);

  const handleCloseEditServiceModal = useCallback(() => {
    setIsEditServiceModalOpen(false);
    setSelectedServiceToEdit(null);
  }, []);

  const handleDetailRole = useCallback((idRole: string) => {
    navigate(`/role-management-access/detail/${idRole}`);
  }, [navigate]);

  const handleDetailLayanan = useCallback((idLayanan: string) => {
    navigate(`/role-management-access/service-detail/${idLayanan}`);
  }, [navigate]);

  const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  }, []);

  return {
    roleData,
    layananData,
    handleAddRole,
    handleAddLayanan,
    handleDeleteRole,
    handleDeleteLayanan,
    handleEditRole,
    handleEditLayanan,
    handleDetailRole,
    handleDetailLayanan,
    isAddServiceModalOpen,
    handleCloseAddServiceModal,
    isDeleteServiceModalOpen,
    handleCloseDeleteServiceModal,
    selectedServiceToDelete,
    handleConfirmDeleteService,
    isEditServiceModalOpen,
    handleCloseEditServiceModal,
    selectedServiceToEdit,
    isDeleteRoleModalOpen,
    handleCloseDeleteRoleModal,
    selectedRoleToDelete,
    handleConfirmDeleteRole,
    columnFilters,
    handleColumnFilterChange,
  };
}
