import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TabWithUnderline from '../../../../../components/ui/tabs/TabWithUnderline';
import Button from '../../../../../components/ui/button/Button';
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
  const mode = query.get('mode') || 'view';
  const isEditable = mode === 'edit';

  const [data, setData] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    { id: 'contract', label: 'Contract' },
    { id: 'organization-history', label: 'Organization History' },
    { id: 'pelanggaran', label: 'Pelanggaran' },
    { id: 'story-payroll', label: 'Story Payroll' },
  ];

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
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`}
              alt={data.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="text-base font-semibold">{data.name}</div>
              <div className="text-sm text-gray-500">{data.posisi} | {data.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Bagikan</Button>
            <Button variant="primary" size="sm">Ekspor</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabWithUnderline
        tabs={tabs}
        initialActiveId={'personal-information'}
        renderContent={(activeId) => {
          switch (activeId) {
            case 'personal-information':
              return <PesonalInformationTab data={data} isEditable={isEditable} />;
            case 'contract':
              return <ContractTab data={data} isEditable={isEditable} />;
            case 'organization-history':
              return <OrganizationHistoryTab data={data} isEditable={isEditable} />;
            case 'pelanggaran':
              return <PelanggaranTab data={data} isEditable={isEditable} />;
            case 'story-payroll':
              return <StoryPayrollTab data={data} isEditable={isEditable} />;
            default:
              return null;
          }
        }}
      />
    </div>
  );
}