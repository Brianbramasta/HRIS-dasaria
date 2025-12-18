import { useEffect, useState } from "react";

type TabOption = { id: string; label: string };

interface ChartTabProps {
  options?: TabOption[];
  selected?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const defaultOptions: TabOption[] = [
  { id: "bulanan", label: "Bulanan" },
  { id: "kuartalan", label: "Kuartalan" },
  { id: "tahunan", label: "Tahunan" },
];

const ChartTab: React.FC<ChartTabProps> = ({
  options = defaultOptions,
  selected,
  onChange,
  className = "",
}) => {
  const [internalSelected, setInternalSelected] = useState<string>(
    selected ?? options[0]?.id
  );

  useEffect(() => {
    setInternalSelected(selected ?? options[0]?.id);
  }, [selected, options]);

  const getButtonClass = (id: string) =>
    (selected ?? internalSelected) === id
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const handleClick = (id: string) => {
    if (selected === undefined) {
      setInternalSelected(id);
    }
    onChange?.(id);
  };

  return (
    <div className={`flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleClick(opt.id)}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            opt.id
          )}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
