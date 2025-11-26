import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Tabs from '../../../../structure-and-organize/components/Tabs';
// import Button from '../../../../../components/ui/button/Button';
import { karyawanService } from '../../../../staff/services/karyawanService';
import type { Karyawan } from '../../../../staff/types/Karyawan';
import PesonalInformationTab from './tab/pesonalInformation';
import ContractTab from './tab/contract';
import OrganizationHistoryTab from './tab/organizationHistory';
import PelanggaranTab from './tab/pelanggaran';
import StoryPayrollTab from './tab/storyPayroll';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function DetailKaryawanPage() {
  const { id } = useParams();
  const query = useQuery();
  const location = useLocation();
  const mode = query.get('mode') || 'view';
  const isEditable = mode === 'edit';
  const tabParam = (query.get('tab') || 'personal-information').toLowerCase();

  const [data, setData] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('id',id)
    let active = true;
    async function fetchDetail() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await karyawanService.getKaryawanById(id);
        if (!active) return;
        setData(res.data as unknown as Karyawan);
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : 'Gagal memuat detail karyawan';
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      active = false;
    };
  }, [id]);

  const tabs = [
    { id: 'personal-information', label: 'Personal Information' },
    { id: 'contract', label: 'Kontrak' },
    { id: 'organization-history', label: 'Riwayat Organisasi' },
    { id: 'pelanggaran', label: 'Pelanggaran' },
    { id: 'story-payroll', label: 'Riwayat Penggajian' },
  ].map(t => {
    const params = new URLSearchParams(location.search);
    params.set('tab', t.id);
    return { id: t.id, label: t.label, link: `${location.pathname}?${params.toString()}` };
  });

  if (loading) {
    return <div className="p-6">Memuat detail…</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">Data tidak ditemukan.</div>;
  }

  

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`}
              alt={data.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="text-base font-semibold">{data.name || 'Megawati'}</div>
              <div className="text-sm text-gray-500">{data.posisi || 'Staff'} | {data.company || 'PT. Dasaria Indonesia'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button ><img src='/images/icons/sosial-media/x.svg'/></button>
            <button ><img src='/images/icons/sosial-media/linkedin.svg'/></button>
            <button ><img src='/images/icons/sosial-media/facebook.svg'/></button>
            <button ><img src='/images/icons/sosial-media/instagram.svg'/></button>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tabs.some(t => t.id === tabParam) ? tabParam : 'personal-information'} className="justify-between mb-4" />
      {(() => {
        switch (tabs.some(t => t.id === tabParam) ? tabParam : 'personal-information') {
          case 'personal-information':
            return <PesonalInformationTab data={data} isEditable={isEditable} />;
          case 'contract':
            return <ContractTab data={data} isEditable={isEditable} />;
          case 'organization-history':
            return <OrganizationHistoryTab data={data} isEditable={isEditable} />;
          case 'pelanggaran':
            return <PelanggaranTab />;
          case 'story-payroll':
            return <StoryPayrollTab data={data} isEditable={isEditable} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
