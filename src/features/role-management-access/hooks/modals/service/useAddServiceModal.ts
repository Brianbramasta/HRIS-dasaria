import { useState, useCallback, useEffect } from 'react';

export interface ServiceItem {
  id: number;
  name: string;
}

export const useAddServiceModal = (isOpen: boolean, onClose: () => void) => {
  const [services, setServices] = useState<ServiceItem[]>([{ id: Date.now(), name: '' }]);

  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when modal opens
      setServices([{ id: Date.now(), name: '' }]);
    }
  }, [isOpen]);

  const handleAddService = useCallback(() => {
    setServices((prev) => [...prev, { id: Date.now(), name: '' }]);
  }, []);

  const handleRemoveService = useCallback((id: number) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  }, []);

  const handleServiceChange = useCallback((id: number, value: string) => {
    setServices((prev) =>
      prev.map((service) => (service.id === id ? { ...service, name: value } : service))
    );
  }, []);

  const handleSubmit = useCallback(() => {
    // Filter out empty services before submitting if needed
    const validServices = services.filter(s => s.name.trim() !== '');
    console.log('Submitting services:', validServices);
    // Here you would typically call an API
    onClose();
  }, [services, onClose]);

  return {
    services,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    handleSubmit,
  };
};
