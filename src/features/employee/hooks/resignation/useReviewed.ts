import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePengunduranDiri from './usePengunduranDiri';

export const useReviewed = () => {
  const navigate = useNavigate();
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
  } = usePengunduranDiri({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
    status: 'Disetujui' as const,
  });

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
    isStatusDropdownOpen,

    // Actions
    fetchPengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    toggleStatusDropdown,
    closeStatusDropdown,
    handleNavigateToView,
  };
};
