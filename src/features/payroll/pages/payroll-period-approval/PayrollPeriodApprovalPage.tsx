

// Dokumentasi: Halaman Approval Periode Gajian dengan skema Tabs + Outlet, mirip PeriodePenggajianPage
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';
import { useApiPayrollPeriod } from '../../hooks/api/useApiPayrollPeriod';

export default function ApprovalPeriodeGajianPage() {
  // Dokumentasi: menentukan tab aktif dan menyembunyikan Tabs saat halaman detail
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period-approval/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period-approval/ae' },
    // { id: 'pkl', label: 'PKL', link: '/payroll-period-approval/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period-approval/thr' },
  ];

  // Helper function to transform API response to PayrollCard format
  const transformApiDataToCards = (apiData: any): PayrollCard[] => {
    if (!apiData?.summary?.[0]?.card) return [];
    
    return apiData.summary[0].card.map((card: any) => {
      let statusColor: 'success' | 'info' | 'error' = 'error';
      let statusLabel = 'Belum Proses';
      
      if (card.remaining === 0) {
        statusColor = 'success';
        statusLabel = 'Selesai';
      } else if (card.progress > 0) {
        statusColor = 'info';
        statusLabel = 'Dalam Proses';
      }
      
      return {
        name: card.label,
        statusLabel,
        statusColor,
        remaining: card.remaining,
        progressCurrent: card.progress,
        progressTotal: card.total
      };
    });
  };

  const [cardsData, setCardsData] = useState<PayrollCard[]>([]);
  const { fetchImportApprovalStatus } = useApiPayrollPeriod();

  // Map tab to type
  const getTabType = (tab: string): 'Staff' | 'Mitra' | 'Thr' => {
    switch (tab) {
      case 'ae': return 'Mitra';
      case 'thr': return 'Thr';
      default: return 'Staff';
    }
  };

  // Get approval parameter based on active tab (default to HRGA)
  const getApprovalParams = () => {
    // For approval pages, we need to determine which approval level to check
    // This would typically come from the active dropdown in the tab components
    // For now, defaulting to HRGA for all tabs
    return {
      HRGA: true,
      FAT: false,
      BOD: false
    };
  };

  // Fetch card data when tab changes
  useEffect(() => {
    const loadCardData = async () => {
      try {
        const type = getTabType(activeTab);
        const approvalParams = getApprovalParams();
        
        const result = await fetchImportApprovalStatus({
          type,
          ...approvalParams
        });
        
        if (result) {
          const transformedData = transformApiDataToCards(result);
          setCardsData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
        // Fallback to empty array on error
        setCardsData([]);
      }
    };

    if (!isDetailPage) {
      loadCardData();
    }
  }, [activeTab, isDetailPage, fetchImportApprovalStatus]);

  return (
    <div className="space-y-6">
      {!isDetailPage && (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} />
          <div className="mt-4">
            <CardsPayroll items={cardsData} />
          </div>
        </>
      )}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}
