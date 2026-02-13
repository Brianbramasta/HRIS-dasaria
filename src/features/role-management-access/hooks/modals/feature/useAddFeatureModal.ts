import { useState, useCallback, useEffect } from 'react';
import { useApiFeatures } from '../../api/useApiFeatures';

export interface FeatureItem {
  id: number;
  name: string;
}

export const useAddFeatureModal = (
  isOpen: boolean, 
  onClose: () => void,
  modulId?: string,
  onSuccess?: () => void
) => {
  const [features, setFeatures] = useState<FeatureItem[]>([{ id: Date.now(), name: '' }]);
  const { createFeature, loading } = useApiFeatures();

  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when modal opens
      setFeatures([{ id: Date.now(), name: '' }]);
    }
  }, [isOpen]);

  const handleAddFeature = useCallback(() => {
    setFeatures((prev) => [...prev, { id: Date.now(), name: '' }]);
  }, []);

  const handleRemoveFeature = useCallback((id: number) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  }, []);

  const handleFeatureChange = useCallback((id: number, value: string) => {
    setFeatures((prev) =>
      prev.map((feature) => (feature.id === id ? { ...feature, name: value } : feature))
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!modulId) return;

    // Filter out empty features before submitting
    const validFeatureNames = features
      .map(f => f.name.trim())
      .filter(name => name !== '');

    if (validFeatureNames.length === 0) {
      // Handle validation error (e.g., show toast)
      return;
    }

    const success = await createFeature({
      modules_id: modulId,
      name: validFeatureNames,
    });

    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [features, modulId, createFeature, onSuccess, onClose]);

  return {
    features,
    handleAddFeature,
    handleRemoveFeature,
    handleFeatureChange,
    handleSubmit,
    loading,
  };
};
