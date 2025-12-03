import React from 'react';

import { Link } from 'react-router-dom';

interface TabProps {
  tabs: { id: string; label: string; link: string }[];
  activeTab: string;
  className?: string;
}

const Tabs: React.FC<TabProps> = ({ tabs, activeTab, className }) => {

  return (
    <div className={`px-6 flex ${className || 'justify-between'} overflow-x-auto rounded-lg bg-gray-200  py-[10px] dark:bg-gray-900 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 mb-0`}>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.link}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900 shadow-theme-xs dark:bg-white/[0.3] dark:text-white'
                      : 'bg-transparent text-[#000] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
  );
};

export default Tabs;