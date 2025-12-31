import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Tabs from '../../../../../components/shared/Tabs';
import PesonalInformationTab from '../../../components/employee-data/tab/PesonalInformation';
import ContractTab from '../../../components/employee-data/tab/Contract';
import OrganizationHistoryTab from '../../../components/employee-data/tab/OrganizationHistory';
import PelanggaranTab from '../../../components/employee-data/tab/Fraud';
import StoryPayrollTab from '../../../components/employee-data/tab/StoryPayroll';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

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
  const {detail, fetchDetail} = useDetailDataKaryawanPersonalInfo();
  useEffect(() => { fetchDetail(id!); }, [id, fetchDetail]);

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

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <img
              src={detail?.Personal_Data?.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=${id}'}
              alt="Employee Avatar"
              className="h-12 w-12 rounded-full"
            />
            <div className='text-center md:text-left'>
              <div className="text-base font-semibold">{detail?.Personal_Data?.full_name}</div>
              <div className="text-sm text-gray-500">{detail?.Employment_Position_Data?.department_name} | {detail?.Employment_Position_Data?.user_access}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {detail?.Social_Media_Data[0]?.twitter_name && <a href={detail?.Social_Media_Data[0]?.twitter_name} target='_blank'><img src='/images/icons/sosial-media/x.svg'/></a>}
            {detail?.Social_Media_Data[0]?.linkedin_name && <a href={detail?.Social_Media_Data[0]?.linkedin_name} target='_blank'><img src='/images/icons/sosial-media/linkedin.svg'/></a>}
            {detail?.Social_Media_Data[0]?.facebook_name && <a href={detail?.Social_Media_Data[0]?.facebook_name} target='_blank'><img src='/images/icons/sosial-media/facebook.svg'/></a>}
            {detail?.Social_Media_Data[0]?.instagram_name && <a href={detail?.Social_Media_Data[0]?.instagram_name} target='_blank'><img src='/images/icons/sosial-media/instagram.svg'/></a>}
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tabs.some(t => t.id === tabParam) ? tabParam : 'personal-information'} className="justify-between mb-4" />
      {(() => {
        switch (tabs.some(t => t.id === tabParam) ? tabParam : 'personal-information') {
          case 'personal-information':
            return <PesonalInformationTab employeeId={id!} isEditable={isEditable} />;
          case 'contract':
            return <ContractTab employeeId={id!} data={{} as any} />;
          case 'organization-history':
            return <OrganizationHistoryTab data={{} as any} isEditable={isEditable} />;
          case 'pelanggaran':
            return <PelanggaranTab />;
          case 'story-payroll':
            return <StoryPayrollTab data={{} as any} isEditable={isEditable} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
