import { useState, useCallback } from 'react';
import {
  FeatureItem,
  FeatureDetailResult,
  CreateFeaturePayload,
  UpdateFeaturePayload,
} from '../../types/dto/FeaturesType';
import { featuresService } from '../../services/FeaturesService';

interface UseApiFeaturesReturn {
  loading: boolean;
  error: string | null;

  // Data State
  features: FeatureItem[];
  featureDetail: FeatureDetailResult | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchFeatures: (params?: any) => Promise<void>;
  fetchFeatureDetail: (id: string) => Promise<void>;
  createFeature: (payload: CreateFeaturePayload) => Promise<boolean>;
  updateFeature: (id: string, payload: UpdateFeaturePayload) => Promise<boolean>;
  deleteFeature: (id: string) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiFeatures = (): UseApiFeaturesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [featureDetail, setFeatureDetail] = useState<FeatureDetailResult | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchFeatures = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.getFeatures(params);
      if (response.data) {
        setFeatures(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch features';
      setError(msg);
      console.error('Error fetching features:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatureDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.getFeatureDetail(id);
      if (response.data) {
        setFeatureDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch feature detail';
      setError(msg);
      console.error('Error fetching feature detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeature = useCallback(async (payload: CreateFeaturePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await featuresService.createFeature(payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create feature';
      setError(msg);
      console.error('Error creating feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeature = useCallback(async (id: string, payload: UpdateFeaturePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await featuresService.updateFeature(id, payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update feature';
      setError(msg);
      console.error('Error updating feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFeature = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await featuresService.deleteFeature(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete feature';
      setError(msg);
      console.error('Error deleting feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setFeatureDetail(null);
  }, []);

  return {
    loading,
    error,
    features,
    featureDetail,
    pagination,
    fetchFeatures,
    fetchFeatureDetail,
    createFeature,
    updateFeature,
    deleteFeature,
    resetDetail,
  };
};
