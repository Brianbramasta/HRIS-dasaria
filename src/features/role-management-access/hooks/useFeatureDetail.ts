import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export interface FeatureData {
  no: number;
  idFitur: string;
  fitur: string;
  modul: string;
}

export default function useFeatureDetail() {
  const { modulId } = useParams<{ modulId: string }>();
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
  const [isDeleteFeatureModalOpen, setIsDeleteFeatureModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);
  
  // Mock data based on the design
  const [featureData] = useState<FeatureData[]>([
    { no: 1, idFitur: 'F001', fitur: 'Data Karyawan', modul: 'Data Master Karyawan' },
    { no: 2, idFitur: 'F002', fitur: 'Perpanjangan Kontrak', modul: 'Data Master Karyawan' },
    { no: 3, idFitur: 'F003', fitur: 'Pengunduran Diri', modul: 'Data Master Karyawan' },
    { no: 4, idFitur: 'F004', fitur: 'Data Master Karyawan', modul: 'Perubahan Organisasi' },
  ]);

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
    console.log('Detail feature:', row);
  }, []);

  const onDeleteConfirm = useCallback(() => {
    console.log('Deleting feature:', selectedFeature);
    setIsDeleteFeatureModalOpen(false);
    setSelectedFeature(null);
  }, [selectedFeature]);

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
    onDeleteConfirm
  };
}
