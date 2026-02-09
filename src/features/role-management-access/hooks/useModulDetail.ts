import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiModules } from './api/useApiModules';
import { ModuleListItem } from '../types/dto/ModulesType';

export interface ModulData {
  no: number;
  idModul: string;
  sistemLayanan: string;
  modul: string;
  apps_id: string; // Added for reference
}

export default function useModulDetail() {
  const { layananId } = useParams<{ layananId: string }>();
  const navigate = useNavigate();
  
  const {
    modules,
    loading,
    pagination,
    fetchModules,
    deleteModule,
  } = useApiModules();

  const [isAddModulModalOpen, setIsAddModulModalOpen] = useState(false);
  const [isEditModulModalOpen, setIsEditModulModalOpen] = useState(false);
  const [isDeleteModulModalOpen, setIsDeleteModulModalOpen] = useState(false);
  const [selectedModul, setSelectedModul] = useState<ModulData | null>(null);

  // Fetch data on mount or when layananId changes
  useEffect(() => {
    if (layananId) {
      fetchModules({ apps_id: layananId, per_page: 100 }); // Assuming we want all or paginated
    }
  }, [layananId, fetchModules]);

  // Map API data to UI format
  const modulData: ModulData[] = modules.map((item: ModuleListItem, index: number) => ({
    no: index + 1 + (pagination.currentPage - 1) * pagination.perPage,
    idModul: item.id,
    sistemLayanan: item.apps_name,
    modul: item.name,
    apps_id: item.apps_id,
  }));

  const handleAddModul = useCallback(() => {
    setIsAddModulModalOpen(true);
  }, []);

  const handleEditModul = useCallback((row: ModulData) => {
    setSelectedModul(row);
    setIsEditModulModalOpen(true);
  }, []);

  const handleDeleteModul = useCallback((row: ModulData) => {
    setSelectedModul(row);
    setIsDeleteModulModalOpen(true);
  }, []);

  const handleDetailModul = useCallback((row: ModulData) => {
    navigate(`/role-management-access/feature-detail/${row.idModul}`, {
      state: { layananId }
    });
  }, [navigate, layananId]);

  const onDeleteConfirm = useCallback(async () => {
    if (selectedModul) {
      const success = await deleteModule(selectedModul.idModul);
      if (success && layananId) {
        fetchModules({ apps_id: layananId });
        setIsDeleteModulModalOpen(false);
        setSelectedModul(null);
      }
    }
  }, [selectedModul, deleteModule, layananId, fetchModules]);

  const refreshData = useCallback(() => {
    if (layananId) {
      fetchModules({ apps_id: layananId });
    }
  }, [layananId, fetchModules]);

  return {
    layananId,
    modulData,
    loading,
    pagination,
    handleAddModul,
    handleEditModul,
    handleDeleteModul,
    handleDetailModul,
    isAddModulModalOpen,
    setIsAddModulModalOpen,
    isEditModulModalOpen,
    setIsEditModulModalOpen,
    isDeleteModulModalOpen,
    setIsDeleteModulModalOpen,
    selectedModul,
    onDeleteConfirm,
    refreshData,
  };
}
