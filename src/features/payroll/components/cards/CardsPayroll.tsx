import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import Badge from '@/components/ui/badge/Badge';
import ProgressBar from '@/components/ui/progressbar/ProgressBar';
import { User } from 'react-feather';
import React from 'react';

export type PayrollCard = {
  name: string;
  statusLabel: string;
  statusColor: 'success' | 'info' | 'error';
  remaining: number;
  progressCurrent: number;
  progressTotal: number;
};

const CardsPayroll: React.FC<{ items: PayrollCard[] }> = ({ items }) => {
  const desktopCols = Math.min(items.length, 4);
  const colsClass =
    desktopCols === 1
      ? 'lg:grid-cols-1'
      : desktopCols === 2
      ? 'lg:grid-cols-2'
      : desktopCols === 3
      ? 'lg:grid-cols-3'
      : 'lg:grid-cols-4';
  const smColsClass = items.length > 1 ? 'sm:grid-cols-2' : 'sm:grid-cols-1';
  return (
    <div className={`grid grid-cols-1 ${smColsClass} ${colsClass} gap-4`}>
      {items.map((item) => {
        const percent =
          item.progressTotal > 0
            ? Math.round((item.progressCurrent / item.progressTotal) * 100)
            : 0;
        return (
          <Card key={item.name}>
            <div className="flex items-center justify-between border-b-[3px]">
              <CardTitle>{item.name}</CardTitle>
              <Badge variant="solid" color={item.statusColor} size="sm">
                {item.statusLabel}
              </Badge>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <CardDescription>Remaining</CardDescription>
                <div className="flex items-center gap-1 text-error-600 dark:text-error-500">
                  <User size={14} />
                  <span className="text-sm font-medium">{item.remaining}</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <CardDescription>Progress</CardDescription>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
                    <User size={14} />
                    {item.progressCurrent}/{item.progressTotal}
                  </span>
                </div>
                <ProgressBar progress={percent} size="md" label="none" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CardsPayroll;
