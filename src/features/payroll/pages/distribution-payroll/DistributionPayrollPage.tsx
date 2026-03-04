// Dokumentasi: Halaman Distribusi Gaji menggunakan skema Tabs + Outlet (mirip PeriodePenggajianPage)
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';
import { useApiPayrollPeriod } from '../../hooks/api/useApiPayrollPeriod';

export default function DistribusiGajiPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';
  // const [resetKey, setResetKey] = useState('');

  // Dokumentasi: Render tab content berdasarkan activeTab
  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case 'non-ae':
  //       return <NonAEPages key={`non-ae-${resetKey}`} />;
  //     case 'ae':
  //       return <AEPages key={`ae-${resetKey}`} />;
  //     case 'pkl':
  //       return <PKLPages key={`pkl-${resetKey}`} />;
  //     default:
  //       return <NonAEPages key={`non-ae-${resetKey}`} />;
  //   }
  // };

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/salary-distribution/non-ae' },
    { id: 'ae', label: 'AE', link: '/salary-distribution/ae' },
    { id: 'thr', label: 'THR', link: '/salary-distribution/thr' },
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
        name: `Distribusi ${card.label}`,
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

  // Fetch card data when tab changes
  useEffect(() => {
    const loadCardData = async () => {
      try {
        const type = getTabType(activeTab);
        const result = await fetchImportApprovalStatus({
          type,
          distribution: true
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

    loadCardData();
  }, [activeTab, fetchImportApprovalStatus]);

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} />
      <div className="py-4">
        <div className="mb-4">
          <CardsPayroll items={cardsData} />
        </div>
        {/* {renderTabContent()} */}
        <Outlet />
      </div>
    </div>
  );
}
