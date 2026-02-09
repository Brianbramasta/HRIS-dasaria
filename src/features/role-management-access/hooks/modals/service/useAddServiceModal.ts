import { useState, useCallback, useEffect } from 'react';
import { useApiApps } from '../../api/useApiApps';

export interface ServiceItem {
  id: number;
  name: string;
}

export const useAddServiceModal = (isOpen: boolean, onClose: () => void, onSuccess?: () => void) => {
  const [services, setServices] = useState<ServiceItem[]>([{ id: Date.now(), name: '' }]);
  const { createApp } = useApiApps();

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

  const handleSubmit = useCallback(async () => {
    // Filter out empty services
    const validServices = services.filter(s => s.name.trim() !== '');
    if (validServices.length === 0) return;

    const payload = {
      name: validServices.map(s => s.name)
    };

    const success = await createApp(payload);
    
    if (success) {
      onSuccess?.();
      onClose();
    }
  }, [services, createApp, onSuccess, onClose]);

  return {
    services,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    handleSubmit,
  };
};
