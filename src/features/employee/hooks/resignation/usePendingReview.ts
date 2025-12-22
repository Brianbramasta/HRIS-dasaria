import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PengunduranDiri } from '../../types/Resignation';
import usePengunduranDiri from './usePengunduranDiri';

export const usePendingReview = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<PengunduranDiri | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const {
    data,
    loading,
    error,
    page,
    limit,
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    approvePengunduranDiri,
    rejectPengunduranDiri,
  } = usePengunduranDiri({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
    status: 'In Progress' as const,
  });

  // Handle navigate to detail
  const handleNavigateToDetail = (id: string) => {
    navigate(`/resignation/${id}`);
  };

  // Handle open approve modal
  const handleOpenApproveModal = (row: PengunduranDiri) => {
    setSelectedItem(row);
    setShowApproveModal(true);
  };

  // Handle open reject modal
  const handleOpenRejectModal = (row: PengunduranDiri) => {
    setSelectedItem(row);
    setShowRejectModal(true);
  };

  // Handle close approve modal
  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setTanggalEfektif('');
    setSelectedItem(null);
  };

  // Handle close reject modal
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedItem(null);
  };

  // Confirm approve
  const confirmApprove = async () => {
    if (!selectedItem || !tanggalEfektif) return;

    try {
      await approvePengunduranDiri(selectedItem.id, tanggalEfektif);
      handleCloseApproveModal();
    } catch (err) {
      // Error handled in hook
    }
  };

  // Confirm reject
  const confirmReject = async () => {
    if (!selectedItem) return;

    try {
      await rejectPengunduranDiri(selectedItem.id);
      handleCloseRejectModal();
    } catch (err) {
      // Error handled in hook
    }
  };

  // Handle status dropdown toggle
  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  // Handle status dropdown close
  const closeStatusDropdown = () => {
    setIsStatusDropdownOpen(false);
  };

  // Handle navigate to view
  const handleNavigateToView = (view: 'pending' | 'reviewed') => {
    closeStatusDropdown();
    navigate(`/resignation?view=${view}`);
  };

  return {
    // Data
    data,
    loading,
    error,
    page,
    limit,
    selectedItem,
    showApproveModal,
    showRejectModal,
    tanggalEfektif,
    isStatusDropdownOpen,

    // Actions
    setTanggalEfektif,
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleNavigateToDetail,
    handleOpenApproveModal,
    handleOpenRejectModal,
    handleCloseApproveModal,
    handleCloseRejectModal,
    confirmApprove,
    confirmReject,
    toggleStatusDropdown,
    closeStatusDropdown,
    handleNavigateToView,
  };
};
