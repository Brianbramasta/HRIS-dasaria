// Dokumentasi: Halaman Distribusi Gaji menggunakan skema Tabs + Outlet (mirip PeriodePenggajianPage)
import { Outlet, useLocation } from 'react-router-dom';
// import { useState } from 'react';
import Tabs from '@/components/shared/Tabs';
import CardsPayroll, { PayrollCard } from '../../components/cards/CardsPayroll';
// import NonAEPages from './tab/NonAEPages';
// import AEPages from './tab/AEPages';
// import PKLPages from './tab/PKLPages';

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

  const cardsData: PayrollCard[] = [
    { name: 'Distribusi Dasarata', statusLabel: 'Dalam Proses', statusColor: 'info', remaining: 20, progressCurrent: 80, progressTotal: 100 },
    { name: 'Distribusi GriyaNet', statusLabel: 'Belum Proses', statusColor: 'error', remaining: 100, progressCurrent: 0, progressTotal: 100 },
  ];

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
