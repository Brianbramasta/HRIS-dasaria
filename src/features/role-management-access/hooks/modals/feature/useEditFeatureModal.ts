import { useState, useCallback, useEffect } from 'react';
import { FeatureData } from '../../../hooks/useFeatureDetail';

export const useEditFeatureModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: FeatureData | null
) => {
  const [featureName, setFeatureName] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setFeatureName(initialData.fitur);
    }
  }, [isOpen, initialData]);

  const handleFeatureChange = useCallback((value: string) => {
    setFeatureName(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!initialData) return;
    
    // Validasi sederhana
    if (!featureName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    console.log('Updating feature:', { ...initialData, fitur: featureName });
    // Di sini nanti panggil API update
    onClose();
  }, [initialData, featureName, onClose]);

  return {
    featureName,
    handleFeatureChange,
    handleSubmit,
  };
};
