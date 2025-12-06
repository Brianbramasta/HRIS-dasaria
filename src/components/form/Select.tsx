import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });

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
      const target = e.target as Node;
      const isInsideTrigger = ref.current && ref.current.contains(target);
      const isInsideMenu = menuRef.current && menuRef.current.contains(target);
      if (!isInsideTrigger && !isInsideMenu) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + 4;
      setMenuStyle({ left: rect.left, top, width: rect.width });
    };
    reposition();
    document.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

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
        ref={buttonRef}
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

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", left: menuStyle.left, top: menuStyle.top, width: menuStyle.width }}
            className="z-[100000] rounded-lg border border-gray-300 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-700"
          >
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
          </div>,
          document.body
        )}
    </div>
  );
};

export default Select;
