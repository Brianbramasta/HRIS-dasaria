import React from 'react';

type SectionCardProps = {
  title: string;
  leftIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  withHeaderDivider?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  leftIcon,
  headerRight,
  withHeaderDivider = false,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white ${className ?? ''}`}>
      <div
        className={`flex items-center justify-between p-6 ${
          withHeaderDivider ? 'border-b border-gray-200 dark:border-gray-800' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {leftIcon}
        </div>
        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>

      <div className={contentClassName ?? 'p-4'}>{children}</div>
    </div>
  );
}

