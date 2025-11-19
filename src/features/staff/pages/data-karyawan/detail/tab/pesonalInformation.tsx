import type { Karyawan } from '@/features/staff/types/Karyawan';
import React from 'react';
import PersonalDataCard from '@/features/staff/components/dataKaryawan/card/PersonalDataCard';
import EducationalBackgroundCard from '@/features/staff/components/dataKaryawan/card/EducationalBackgroundCard';
import SocialEmergencyCard from '@/features/staff/components/dataKaryawan/card/SocialEmergencyCard';
import EmployeeDataCard from '@/features/staff/components/dataKaryawan/card/EmployeeDataCard';
import SalaryCard from '@/features/staff/components/dataKaryawan/card/SalaryCard';
import BPJSCard from '@/features/staff/components/dataKaryawan/card/BPJSCard';
import PersonalDocumentsCard from '@/features/staff/components/dataKaryawan/card/PersonalDocumentsCard';
import { karyawanService, type KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  data: Karyawan;
  isEditable: boolean;
}

export default function PesonalInformationTab({ data }: Props) {
  const [detail, setDetail] = React.useState<KaryawanDetailResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);
        const res = await karyawanService.getKaryawanById(data.id);
        if (!active) return;
        setDetail(res.data);
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
  }, [data.id]);

  if (loading) {
    return <div className="p-4">Memuat detail…</div>;
  }
  if (error) {
    return <div className="p-4">{error}</div>;
  }
  if (!detail) {
    return <div className="p-4">Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <PersonalDataCard data={detail.karyawan} personalInformation={detail.personalInformation} />
      <EducationalBackgroundCard education={detail.education} />
      <SocialEmergencyCard personalInformation={detail.personalInformation} />
      <EmployeeDataCard data={detail.karyawan} />
      <SalaryCard financeAndCompliance={detail.financeAndCompliance} />
      <BPJSCard financeAndCompliance={detail.financeAndCompliance} />
      <PersonalDocumentsCard documents={detail.documents} />
    </div>
  );
}