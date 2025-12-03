import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  onSearch?: (query: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  required = false,
  onSearch,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || placeholder;

  const filtered = onSearch
    ? options
    : query
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.value.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const commitChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`text-start h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400"
        } ${className}`}
        onClick={() => setOpen((v) => !v)}
      >
        {selectedLabel}
      </button>

      <select
        value={selectedValue}
        onChange={() => {}}
        required={required}
        className="hidden"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-700">
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const q = e.target.value;
                setQuery(q);
                if (onSearch) onSearch(q);
              }}
              className="h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Cari..."
            />
          </div>
          <ul className="max-h-44 overflow-auto py-1">
            <li>
              <button
                type="button"
                className={`block w-full px-4 py-2 text-left text-sm ${
                  selectedValue === "" ? "bg-brand-50 dark:bg-gray-800" : ""
                }`}
                onClick={() => commitChange("")}
                disabled
              >
                {placeholder}
              </button>
            </li>
            {filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selectedValue === o.value
                      ? "bg-gray-50 dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => commitChange(o.value)}
                >
                  {o.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Tidak ada hasil
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
