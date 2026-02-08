import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabPendingReview from './tab/TabPendingReviewPage';
import TabReviewed from './tab/TabReviewedPage';
import ResignKaryawanModal from '../../components/modals/ResignEmployeeModal';
import ShareLinkModal from '../../components/modals/sharelink/ShareLinkModal';

type TabType = 'pending' | 'reviewed';

export default function ResignationListPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const view = searchParams.get('view');
    setActiveTab(view === 'reviewed' ? 'reviewed' : 'pending');
  }, [searchParams]);

  const handleShareLink = () => {
    setIsModalOpen(false);
    setIsShareOpen(true);
  };

  const goToFormResign = () => {
    setIsModalOpen(false);
    navigate('/resignation/form');
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        {activeTab === 'pending' && <TabPendingReview />}
        {activeTab === 'reviewed' && <TabReviewed />}
      </div>

      <ResignKaryawanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShareLink={handleShareLink}
        onFormResign={goToFormResign}
      />

      <ShareLinkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        link={`${window.location.origin}/resignation/form`}
        message={'Silakan isi data karyawan melalui tautan berikut'}
      />
    </div>
  );
}
