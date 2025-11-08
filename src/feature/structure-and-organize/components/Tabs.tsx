import React from 'react';
import {
  Tabs as MuiTabs,
  Tab,
  Box,
  Typography,
} from '@mui/material';

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
  variant = 'scrollable',
  orientation = 'horizontal',
  centered = false,
  className,
}: TabsProps) {
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const selectedTab = tabs[newValue];
    if (selectedTab && !selectedTab.disabled) {
      onTabChange(selectedTab.id);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <Box className={className}>
      <MuiTabs
        value={activeTabIndex >= 0 ? activeTabIndex : 0}
        onChange={handleTabChange}
        variant={variant}
        orientation={orientation}
        centered={centered}
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            disabled={tab.disabled}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              '&.Mui-selected': {
                fontWeight: 600,
              },
            }}
          />
        ))}
      </MuiTabs>
      
      <Box sx={{ mt: 3 }}>
        {activeTabContent ? (
          activeTabContent
        ) : (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No content available for this tab
          </Typography>
        )}
      </Box>
    </Box>
  );
}