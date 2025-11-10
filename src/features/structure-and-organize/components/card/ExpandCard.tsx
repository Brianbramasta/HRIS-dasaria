import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

type ExpandCardProps = {
  title: string;
  leftIcon?: React.ReactNode;
  defaultOpen?: boolean;
  withHeaderDivider?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export default function ExpandCard({
  title,
  leftIcon,
  defaultOpen = true,
  withHeaderDivider = false,
  className,
  contentClassName,
  children,
}: ExpandCardProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className ?? ''}`}>
      <div
        className={`flex items-center justify-between p-6 ${
          withHeaderDivider ? 'border-b border-gray-200 dark:border-gray-800' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {leftIcon}
        </div>
        <button
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {open && <div className={contentClassName ?? 'p-4'}>{children}</div>}
    </div>
  );
}