import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { Plus } from 'react-feather';
import TabPendingReview from './TabPendingReview';
import TabReviewed from './TabReviewed';
// import Button from '../../../../components/ui/button/Button';
import ResignKaryawanModal from '../../components/modals/ResignKaryawanModal';
// import { addNotification } from '../../../../stores/notificationStore';
import ShareLinkModal from '../../components/modals/sharelink/shareLink';

type TabType = 'pending' | 'reviewed';

export default function PengunduranDiriPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const view = searchParams.get('view');
    setActiveTab(view === 'reviewed' ? 'reviewed' : 'pending');
  }, [searchParams]);

  const handleAddResign = () => {
    setIsModalOpen(true);
  };

  const handleShareLink = () => {
    setIsModalOpen(false);
    setIsShareOpen(true);
  };

  const goToFormResign = () => {
    setIsModalOpen(false);
    navigate('/pengunduran-diri/form');
  };

  return (
    <div className="space-y-6">
      

      {/* <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"> */}
        {/* <div className="p-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengunduran Diri</h1>
          </div>
        </div> */}

        <div className="p-6">
          {activeTab === 'pending' && <TabPendingReview onOpenForm={handleAddResign} />}
          {activeTab === 'reviewed' && <TabReviewed />}
        </div>
      {/* </div> */}

      {/* Modal Resign */}
      <ResignKaryawanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShareLink={handleShareLink}
        onFormResign={goToFormResign}
      />

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        link={`${window.location.origin}/pengunduran-diri/form`}
        message={'Silakan isi data karyawan melalui tautan berikut'}
      />
    </div>
  );
}
