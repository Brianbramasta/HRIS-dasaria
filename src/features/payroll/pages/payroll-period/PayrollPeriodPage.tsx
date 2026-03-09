

// Dokumentasi: Halaman induk Periode Penggajian dengan skema Tabs + Outlet (mirip StrukturOrganisasiPage)
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';
import { useApiPayrollPeriod } from '../../hooks/api/useApiPayrollPeriod';

export default function PeriodePenggajianPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'non-ae';

  // Dokumentasi: sembunyikan Tabs jika sedang berada di halaman detail (contoh: /daftar-penggajian/non-ae/123)
  const isDetailPage = pathParts.length > 2;

  const tabs = [
    { id: 'non-ae', label: 'Non AE', link: '/payroll-period/non-ae' },
    { id: 'ae', label: 'AE', link: '/payroll-period/ae' },
    // { id: 'pkl', label: 'PKL', link: '/payroll-period/pkl' },
    { id: 'thr', label: 'THR', link: '/payroll-period/thr' },
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

  // Fetch card data when tab changes
  useEffect(() => {
    const loadCardData = async () => {
      try {
        const type = getTabType(activeTab);
        const result = await fetchImportApprovalStatus({
          type,
          periodeSalary: true
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
          {/* <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Periode Gajian</h1>
          </div> */}
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
