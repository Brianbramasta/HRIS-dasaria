import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export interface ModulData {
  no: number;
  idModul: string;
  sistemLayanan: string;
  modul: string;
}

export default function useModulDetail() {
  const { layananId } = useParams<{ layananId: string }>();
  const [isAddModulModalOpen, setIsAddModulModalOpen] = useState(false);
  const [isEditModulModalOpen, setIsEditModulModalOpen] = useState(false);
  const [isDeleteModulModalOpen, setIsDeleteModulModalOpen] = useState(false);
  const [selectedModul, setSelectedModul] = useState<ModulData | null>(null);
  
  // Mock data based on the requirement
  const [modulData] = useState<ModulData[]>([
    { no: 1, idModul: '225150207', sistemLayanan: 'HRIS', modul: 'Dashboard' },
    { no: 2, idModul: '225150205', sistemLayanan: 'HRIS', modul: 'Struktur & Organisasi' },
    { no: 3, idModul: '225150206', sistemLayanan: 'HRIS', modul: 'Data Master Karyawan' },
    { no: 4, idModul: '225150206', sistemLayanan: 'HRIS', modul: 'Penggajian' },
    { no: 5, idModul: '225150206', sistemLayanan: 'HRIS', modul: 'Hak Akses' },
    { no: 6, idModul: '225150206', sistemLayanan: 'HRIS', modul: 'Jenis Pengajuan' },
  ]);

  const handleAddModul = useCallback(() => {
    setIsAddModulModalOpen(true);
  }, []);

  const handleEditModul = useCallback((row: ModulData) => {
    setSelectedModul(row);
    setIsEditModulModalOpen(true);
  }, []);

  const handleDeleteModul = useCallback((row: ModulData) => {
    setSelectedModul(row);
    setIsDeleteModulModalOpen(true);
  }, []);

  const handleDetailModul = useCallback((row: ModulData) => {
    console.log('Detail modul:', row);
  }, []);

  const onDeleteConfirm = useCallback(() => {
    console.log('Deleting modul:', selectedModul);
    setIsDeleteModulModalOpen(false);
    setSelectedModul(null);
  }, [selectedModul]);

  return {
    layananId,
    modulData,
    handleAddModul,
    handleEditModul,
    handleDeleteModul,
    handleDetailModul,
    isAddModulModalOpen,
    setIsAddModulModalOpen,
    isEditModulModalOpen,
    setIsEditModulModalOpen,
    isDeleteModulModalOpen,
    setIsDeleteModulModalOpen,
    selectedModul,
    onDeleteConfirm
  };
}
