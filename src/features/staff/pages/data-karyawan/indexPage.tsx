import { useLocation } from 'react-router-dom';
import Tabs from '../../../structure-and-organize/components/Tabs';
import DataKaryawanPage from './tabs/dataKaryawan';

export default function DataKaryawanIndexPage() {
  const location = useLocation();

  const tabs = [
    { id: 'data-karyawan', label: 'Data Master Karyawan', link: '/data-karyawan' },
    { id: 'perpanjangan-kontrak', label: 'Perpanjangan Kontrak', link: '/data-karyawan/perpanjangan-kontrak' },
  ];

  const pathname = location.pathname;
  const activeTab = pathname.includes('perpanjangan-kontrak')
    ? 'perpanjangan-kontrak'
    : 'data-karyawan';

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} className={'justify-start mb-2'} />
      {/* Tampilkan konten default Data Master Karyawan di bawah Tabs */}
      <DataKaryawanPage />
    </div>
  );
}