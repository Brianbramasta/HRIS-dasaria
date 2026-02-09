import { useState, useCallback, useEffect } from 'react';
import { FeatureData } from '../../../hooks/useFeatureDetail';
import { useApiFeatures } from '../../api/useApiFeatures';

export const useEditFeatureModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: FeatureData | null,
  onSuccess?: () => void
) => {
  const [featureName, setFeatureName] = useState('');
  const { updateFeature, loading } = useApiFeatures();

  useEffect(() => {
    if (isOpen && initialData) {
      setFeatureName(initialData.fitur);
    }
  }, [isOpen, initialData]);

  const handleFeatureChange = useCallback((value: string) => {
    setFeatureName(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!initialData || !initialData.idFitur) return;
    
    // Validasi sederhana
    if (!featureName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    const success = await updateFeature(initialData.idFitur, {
      name: featureName,
    });

    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [initialData, featureName, onClose, updateFeature, onSuccess]);

  return {
    featureName,
    handleFeatureChange,
    handleSubmit,
    loading,
  };
};
