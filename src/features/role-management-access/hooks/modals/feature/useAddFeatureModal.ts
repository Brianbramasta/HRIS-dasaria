import { useState, useCallback, useEffect } from 'react';

export interface FeatureItem {
  id: number;
  name: string;
}

export const useAddFeatureModal = (isOpen: boolean, onClose: () => void) => {
  const [features, setFeatures] = useState<FeatureItem[]>([{ id: Date.now(), name: '' }]);

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

  const handleSubmit = useCallback(() => {
    // Filter out empty features before submitting if needed
    const validFeatures = features.filter(s => s.name.trim() !== '');
    console.log('Submitting features:', validFeatures);
    // Here you would typically call an API
    onClose();
  }, [features, onClose]);

  return {
    features,
    handleAddFeature,
    handleRemoveFeature,
    handleFeatureChange,
    handleSubmit,
  };
};
