import { useState } from 'react';
import { Plus } from 'react-feather';
import TabPendingReview from './TabPendingReview';
import TabReviewed from './TabReviewed';
import Button from '../../../../components/ui/button/Button';

type TabType = 'pending' | 'reviewed';

export default function PengunduranDiriPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const handleAddResign = () => {
    console.log('Add new resign form');
    // TODO: Navigate to form resign page or open modal
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengunduran Diri</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola pengajuan pengunduran diri karyawan
          </p>
        </div>
        <Button onClick={handleAddResign} variant="primary" size="sm">
          <Plus size={16} className="mr-2" />
          Form Resign
        </Button>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Pending Review <span className="ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">10</span>
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'reviewed'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Reviewed <span className="ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">99</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'pending' && <TabPendingReview />}
          {activeTab === 'reviewed' && <TabReviewed />}
        </div>
      </div>
    </div>
  );
}