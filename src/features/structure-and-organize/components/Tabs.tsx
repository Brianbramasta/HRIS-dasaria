import React from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  centered?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  // variant = 'scrollable',
  orientation = 'horizontal',
  // centered = false,
  className = '',
}: TabsProps) {
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (!disabled) {
      onTabChange(tabId);
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex gap-6 ${className}`}>
        <div className="flex flex-col min-w-[200px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              className={`text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white '
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              } ${
                tab.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1">
          {activeTabContent ? (
            activeTabContent
          ) : (
            <div className="text-center py-8 text-gray-500">
              No content available for this tab
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="border border-gray-200 rounded-xl dark:border-gray-800">
        <nav className="px-6 flex justify-between overflow-x-auto rounded-lg bg-[var(--color-brand-50)] p-1 dark:bg-gray-900 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-blue-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white'
                  : 'bg-transparent text-[#000] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              } ${
                tab.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 pt-4  border-t-0 border-gray-200 rounded-b-xl dark:border-gray-800">
        {activeTabContent ? (
          activeTabContent
        ) : (
          <div className="text-center py-8 text-gray-500">
            No content available for this tab
          </div>
        )}
      </div>
    </div>
  );
}

export default Tabs;