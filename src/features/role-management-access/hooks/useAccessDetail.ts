import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export interface AccessData {
  no: number;
  idAkses: string;
  akses: string;
  code?: string;
  deskripsi?: string;
  fitur: string;
}

export default function useAccessDetail() {
  const { featureId } = useParams<{ featureId: string }>();

  const [isAddAccessModalOpen, setIsAddAccessModalOpen] = useState(false);
  const [isEditAccessModalOpen, setIsEditAccessModalOpen] = useState(false);
  const [isDeleteAccessModalOpen, setIsDeleteAccessModalOpen] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<AccessData | null>(null);

  const [accessData] = useState<AccessData[]>([
    { no: 1, idAkses: 'A001', akses: 'Tambah', code: '01', deskripsi: 'Lorem ipsum sit eget vivamus nisi mattis vitae adipisicing nunc augue ante aenean sed enim.', fitur: 'Data Karyawan' },
    { no: 2, idAkses: 'A002', akses: 'Edit', code: '02', deskripsi: 'Lorem ipsum sit eget vivamus nisi mattis vitae adipisicing nunc augue ante aenean sed enim.', fitur: 'Data Karyawan' },
    { no: 3, idAkses: 'A003', akses: 'Delete', code: '03', deskripsi: 'Lorem ipsum sit eget vivamus nisi mattis vitae adipisicing nunc augue ante aenean sed enim.', fitur: 'Data Karyawan' },
    { no: 4, idAkses: 'A004', akses: 'Semua', code: '04', deskripsi: 'Lorem ipsum sit eget vivamus nisi mattis vitae adipisicing nunc augue ante aenean sed enim.', fitur: 'Data Karyawan' },
  ]);

  const handleAddAccess = useCallback(() => {
    setIsAddAccessModalOpen(true);
  }, []);

  const handleEditAccess = useCallback((row: AccessData) => {
    setSelectedAccess(row);
    setIsEditAccessModalOpen(true);
  }, []);

  const handleDeleteAccess = useCallback((row: AccessData) => {
    setSelectedAccess(row);
    setIsDeleteAccessModalOpen(true);
  }, []);

  const onDeleteConfirm = useCallback(() => {
    console.log('Deleting access:', selectedAccess);
    setIsDeleteAccessModalOpen(false);
    setSelectedAccess(null);
  }, [selectedAccess]);

  return {
    featureId,
    accessData,
    handleAddAccess,
    handleEditAccess,
    handleDeleteAccess,
    isAddAccessModalOpen,
    setIsAddAccessModalOpen,
    isEditAccessModalOpen,
    setIsEditAccessModalOpen,
    isDeleteAccessModalOpen,
    setIsDeleteAccessModalOpen,
    selectedAccess,
    onDeleteConfirm,
  };
}
