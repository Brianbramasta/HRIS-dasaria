import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApiAccess } from './api/useApiAccess';

export interface AccessData {
  no: number;
  idAkses: string;
  akses: string;
  code?: string;
  deskripsi?: string;
  fitur: string;
}

export default function useAccessDetail() {
  const { featureId } = useParams<{ featureId: string }>();
  const { 
    accessList, 
    fetchAccessList, 
    deleteAccess, 
    loading, 
    pagination 
  } = useApiAccess();

  const [isAddAccessModalOpen, setIsAddAccessModalOpen] = useState(false);
  const [isEditAccessModalOpen, setIsEditAccessModalOpen] = useState(false);
  const [isDeleteAccessModalOpen, setIsDeleteAccessModalOpen] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<AccessData | null>(null);

  useEffect(() => {
    if (featureId) {
      fetchAccessList({ features_id: featureId });
    }
  }, [featureId, fetchAccessList]);

  const accessData: AccessData[] = useMemo(() => {
    return accessList.map((item, index) => ({
      no: (pagination.currentPage - 1) * pagination.perPage + index + 1,
      idAkses: item.id,
      akses: item.name,
      code: item.code,
      deskripsi: item.describe,
      fitur: item.feature_name,
    }));
  }, [accessList, pagination]);

  const handleAddAccess = useCallback(() => {
    setIsAddAccessModalOpen(true);
  }, []);

  const handleEditAccess = useCallback((row: AccessData) => {
    setSelectedAccess(row);
    setIsEditAccessModalOpen(true);
  }, []);

  const handleDeleteAccess = useCallback((row: AccessData) => {
    setSelectedAccess(row);
    setIsDeleteAccessModalOpen(true);
  }, []);

  const onDeleteConfirm = useCallback(async () => {
    if (selectedAccess?.idAkses) {
      const success = await deleteAccess(selectedAccess.idAkses);
      if (success) {
        setIsDeleteAccessModalOpen(false);
        setSelectedAccess(null);
        if (featureId) {
          fetchAccessList({ features_id: featureId });
        }
      }
    }
  }, [selectedAccess, deleteAccess, fetchAccessList, featureId]);

  const refreshData = useCallback(() => {
    if (featureId) {
      fetchAccessList({ features_id: featureId });
    }
  }, [featureId, fetchAccessList]);

  return {
    featureId,
    accessData,
    loading,
    handleAddAccess,
    handleEditAccess,
    handleDeleteAccess,
    isAddAccessModalOpen,
    setIsAddAccessModalOpen,
    isEditAccessModalOpen,
    setIsEditAccessModalOpen,
    isDeleteAccessModalOpen,
    setIsDeleteAccessModalOpen,
    selectedAccess,
    onDeleteConfirm,
    refreshData,
  };
}
