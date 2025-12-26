interface ProgressBarProps {
  percent?: number; // jika diberikan, render single bar dengan persentase ini
  parentClass?: string;
}

export default function ProgressBarWithOutsideLabel({ percent, parentClass }: ProgressBarProps) {
  if (typeof percent === 'number') {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));
    return (
      <div className={`flex items-center gap-3 ${parentClass || ''}`}>
        <div className="sm:max-w-[400px] relative w-full h-6 rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="absolute left-0 h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${pct}%`}}
          ></div>
        </div>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{pct}%</span>
      </div>
    );
  }

  // Default (backwards compatible): render three sample bars
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="sm:max-w-[281px] relative w-full h-2 rounded-sm bg-gray-200 dark:bg-gray-800">
          <div className="absolute left-0 w-[40%] h-full bg-brand-500 rounded-sm"></div>
        </div>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">40%</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="sm:max-w-[281px] relative w-full h-2 rounded-sm bg-gray-200 dark:bg-gray-800">
          <div className="absolute left-0 w-[70%] h-full bg-brand-500 rounded-sm"></div>
        </div>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">70%</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="sm:max-w-[281px] relative w-full h-2 rounded-sm bg-gray-200 dark:bg-gray-800">
          <div className="absolute left-0 w-[30%] h-full bg-brand-500 rounded-sm"></div>
        </div>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">30%</span>
      </div>
    </div>
  );
}
