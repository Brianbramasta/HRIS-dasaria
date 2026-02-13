import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApiFeatures } from './api/useApiFeatures';

export interface FeatureData {
  no: number;
  idFitur: string;
  fitur: string;
  modul: string; // We might leave this empty or redundant if we don't have module name here
}

export default function useFeatureDetail() {
  const { modulId } = useParams<{ modulId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { layananId } = location.state || {};
  
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
  const [isDeleteFeatureModalOpen, setIsDeleteFeatureModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  const {
    features,
    fetchFeatures,
    deleteFeature,
    loading,
  } = useApiFeatures();

  useEffect(() => {
    if (modulId) {
      fetchFeatures({ modules_id: modulId, per_page: 100 }); // Fetch all for now or implement pagination later
    }
  }, [modulId, fetchFeatures]);

  // Map API data to UI data
  const featureData: FeatureData[] = features.map((item, index) => ({
    no: index + 1,
    idFitur: item.id,
    fitur: item.name,
    modul: '', // Module name is not provided in list API, and we are in module detail context anyway
  }));

  const handleAddFeature = useCallback(() => {
    setIsAddFeatureModalOpen(true);
  }, []);

  const handleEditFeature = useCallback((row: FeatureData) => {
    setSelectedFeature(row);
    setIsEditFeatureModalOpen(true);
  }, []);

  const handleDeleteFeature = useCallback((row: FeatureData) => {
    setSelectedFeature(row);
    setIsDeleteFeatureModalOpen(true);
  }, []);

  const handleDetailFeature = useCallback((row: FeatureData) => {
    navigate(`/role-management-access/access-detail/${row.idFitur}`, {
      state: { layananId, modulId }
    });
  }, [navigate, layananId, modulId]);

  const refreshFeatures = useCallback(() => {
    if (modulId) {
      fetchFeatures({ modules_id: modulId, per_page: 100 });
    }
  }, [modulId, fetchFeatures]);

  const onDeleteConfirm = useCallback(async () => {
    if (selectedFeature?.idFitur) {
      const success = await deleteFeature(selectedFeature.idFitur);
      if (success) {
        setIsDeleteFeatureModalOpen(false);
        setSelectedFeature(null);
        refreshFeatures();
      }
    }
  }, [selectedFeature, deleteFeature, refreshFeatures]);

  return {
    modulId,
    featureData,
    handleAddFeature,
    handleEditFeature,
    handleDeleteFeature,
    handleDetailFeature,
    isAddFeatureModalOpen,
    setIsAddFeatureModalOpen,
    isEditFeatureModalOpen,
    setIsEditFeatureModalOpen,
    isDeleteFeatureModalOpen,
    setIsDeleteFeatureModalOpen,
    selectedFeature,
    onDeleteConfirm,
    refreshFeatures,
    loading,
  };
}
