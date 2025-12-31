// Komponen DatePicker kustom berbasis DateRangeFilterPopup untuk input tanggal
// Dokumentasi perubahan utama:
// - Mendukung mode: single, multiple, range, time
// - onChange kini mengirim dua argumen: (Date[], dateStr?: string)
// - dateStr dikirim dalam format ISO (YYYY-MM-DD) untuk tanggal; multiple digabung dengan ", "; range "start to end"; time "HH:MM"
// - Input menampilkan format Indonesia, tetapi keluaran tetap ISO untuk integrasi form
// - Menambahkan fitur Toggle End Date (opsional) untuk beralih antara single dan range mode
import React, { useEffect, useMemo, useRef, useState } from "react";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Button from "@/components/ui/button/Button";
import { formatDateToIndonesian, formatIndonesianToISO } from "@/utils/formatDate";
import Switch from "@/components/form/switch/Switch"; // Import Switch component

type ModeType = "single" | "multiple" | "range" | "time";

export type DatePickerProps = {
  id?: string;
  mode?: ModeType;
  onChange?: (selected: Date[], dateStr?: string) => void;
  defaultDate?: Date | Date[] | string | string[] | { from?: string | Date; to?: string | Date };
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  // Kontrol visibilitas tombol aksi; default false (disembunyikan)
  showActions?: boolean;
  // Dokumentasi: Parameter khusus untuk menampilkan toggle end date
  // Jika true, user bisa beralih antara mode single dan range
  showEndDateToggle?: boolean;
  // Dokumentasi: Kontrol manual visibilitas popup
  isOpen?: boolean;
  onClose?: () => void;
  // Dokumentasi: Element anchor untuk positioning popup (menggantikan inputRef default)
  anchorEl?: HTMLElement | null;
  // Dokumentasi: Sembunyikan input field (untuk penggunaan custom trigger atau popup-only)
  hideInput?: boolean;
  className?: string;
};

// Util: konversi ke string ISO yyyy-mm-dd
function toISO(value?: string | Date | null): string {
  if (!value) return "";
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  // Jika format Indonesia, konversi ke ISO
  const fromIndo = formatIndonesianToISO(value);
  if (fromIndo) return fromIndo;
  // Jika sudah ISO atau string tanggal lain yang valid
  return value;
}

// Util: parse string ISO ke Date
function parseISOToDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

// Util kalender: format yyyy-mm-dd dari (y, mIndex, d)
function fmtYMD(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// Util kalender: jumlah hari dan index hari pertama pada bulan
function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  return { daysInMonth, firstDayOfMonth };
}

export default function DatePicker({
  id = "datepicker",
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  disabled,
  showActions = false,
  showEndDateToggle = false,
  isOpen: controlledIsOpen,
  onClose,
  anchorEl,
  hideInput = false,
  className,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = React.useCallback((open: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    if (!open && onClose) {
      onClose();
    }
  }, [controlledIsOpen, onClose]);

  // State seleksi
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(true);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState<boolean>(false);
  const [timeHour, setTimeHour] = useState<number>(new Date().getHours());
  const [timeMinute, setTimeMinute] = useState<number>(new Date().getMinutes());
  // Dokumentasi: state untuk editing tahun secara manual pada picker
  const [editingYear, setEditingYear] = useState<boolean>(false);
  const [yearInput, setYearInput] = useState<string>("");

  // State untuk single/multiple/range
  const [singleDate, setSingleDate] = useState<string>("");
  const [multipleDates, setMultipleDates] = useState<Set<string>>(new Set());
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");
  // State komit (nilai yang tampil di input saat showActions=true)
  const [committedSingle, setCommittedSingle] = useState<string>("");
  const [committedMultiple, setCommittedMultiple] = useState<Set<string>>(new Set());
  const [committedRangeStart, setCommittedRangeStart] = useState<string>("");
  const [committedRangeEnd, setCommittedRangeEnd] = useState<string>("");
  const [committedTimeHour, setCommittedTimeHour] = useState<number>(timeHour);
  const [committedTimeMinute, setCommittedTimeMinute] = useState<number>(timeMinute);

  // Dokumentasi: State untuk toggle end date (single vs range)
  // Jika showEndDateToggle aktif, state ini menentukan apakah mode "range" aktif
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);

  // Dokumentasi: Tentukan mode efektif
  // Jika showEndDateToggle true, gunakan isRangeMode untuk menentukan "range" atau "single"
  // Jika tidak, gunakan prop mode
  const activeMode = showEndDateToggle ? (isRangeMode ? "range" : "single") : mode;

  // Inisialisasi dari defaultDate
  useEffect(() => {
    if (!defaultDate) return;

    // Logika parsing defaultDate tetap menggunakan struktur data untuk menebak/mengisi state
    // Kita gunakan 'mode' prop asli atau deteksi bentuk data untuk inisialisasi awal
    
    // Helper untuk cek apakah defaultDate terlihat seperti range
    const looksLikeRange = 
      (typeof defaultDate === "object" && "from" in (defaultDate as any) && (defaultDate as any).to) || // Pastikan 'to' ada untuk dianggap range aktif
      (Array.isArray(defaultDate) && defaultDate.length === 2 && showEndDateToggle); // Heuristik sederhana

    if (showEndDateToggle) {
        // Jika toggle aktif, kita percayakan pada bentuk data
        // Jika data punya 'from' dan 'to', atau array 2 elemen, maka range mode
        // Jika tidak (misal cuma 'from' atau single string), maka single mode
        setIsRangeMode(!!looksLikeRange);
    }

    // Logic pengisian state (mirip dengan sebelumnya tapi kita isi semua potensi state agar aman saat toggle)
    // Single
    const isoSingle = Array.isArray(defaultDate)
        ? toISO(defaultDate[0] as any)
        : typeof defaultDate === "object" && "from" in (defaultDate as any)
        ? toISO((defaultDate as any).from)
        : toISO(defaultDate as any);
    if (isoSingle) {
        setSingleDate(isoSingle);
        setCommittedSingle(isoSingle);
    }

    // Range
    const from = typeof defaultDate === "object" && !Array.isArray(defaultDate) ? (defaultDate as any).from : Array.isArray(defaultDate) ? defaultDate[0] : defaultDate;
    const to = typeof defaultDate === "object" && !Array.isArray(defaultDate) ? (defaultDate as any).to : Array.isArray(defaultDate) ? defaultDate[1] : defaultDate;
    const isoFrom = toISO(from as any);
    const isoTo = toISO(to as any);
    if (isoFrom) {
        setRangeStart(isoFrom);
        setCommittedRangeStart(isoFrom);
    }
    if (isoTo) {
        setRangeEnd(isoTo);
        setCommittedRangeEnd(isoTo);
    }

    // Multiple
    const nextMultiple = new Set<string>();
    if (Array.isArray(defaultDate)) {
        for (const v of defaultDate as any[]) {
          const iso = toISO(v);
          if (iso) nextMultiple.add(iso);
        }
    } else {
        const iso = toISO(defaultDate as any);
        if (iso) nextMultiple.add(iso);
    }
    setMultipleDates(nextMultiple);
    setCommittedMultiple(nextMultiple);

    // Time
     const base =
        Array.isArray(defaultDate) && defaultDate.length > 0
          ? defaultDate[0]
          : !Array.isArray(defaultDate)
          ? (defaultDate as any)
          : undefined;
      if (base instanceof Date) {
        setTimeHour(base.getHours());
        setTimeMinute(base.getMinutes());
        setCommittedTimeHour(base.getHours());
        setCommittedTimeMinute(base.getMinutes());
      }

  }, [defaultDate, showEndDateToggle]); 
  // Note: removed 'mode' dependency to avoid reset logic conflict, assuming defaultDate is stable source of truth for init

  // Tutup popup saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedInput = inputRef.current && inputRef.current.contains(e.target as Node);
      const clickedPopup = popupRef.current && popupRef.current.contains(e.target as Node);
      const clickedAnchor = anchorEl && anchorEl.contains(e.target as Node);
      
      if (isOpen && !clickedPopup && !clickedInput && !clickedAnchor) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, anchorEl, setIsOpen]);

  // Posisi popup berdasar anchor input
  const getPosition = () => {
    const targetEl = anchorEl || inputRef.current;
    if (!targetEl) return {};
    const rect = targetEl.getBoundingClientRect();
    const popupWidth = 310;
    // Tambah tinggi sedikit jika ada toggle
    const popupHeight = showEndDateToggle ? 520 : 450;
    const padding = 8;
    
    let left = rect.left;
    if (left + popupWidth > window.innerWidth - padding) {
      left = window.innerWidth - popupWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // Dokumentasi: Logika posisi vertikal
    // Default: Posisi di bawah input dengan overlap -5px agar rapat
    let style: React.CSSProperties = {
      left,
      width: `${popupWidth}px`,
      top: rect.bottom - 5,
    };

    // Cek apakah muat di bawah (menggunakan estimasi height)
    if ((rect.bottom - 5) + popupHeight > window.innerHeight - padding) {
      // Jika tidak muat di bawah, taruh di atas.
      // Dokumentasi: Gunakan properti 'bottom' alih-alih 'top' untuk menangani tinggi konten yang dinamis.
      // Ini mencegah gap besar jika konten popup lebih pendek dari estimasi popupHeight.
      // Jarak 5px dari sisi atas input.
      style = {
        left,
        width: `${popupWidth}px`,
        bottom: window.innerHeight - rect.top + 5,
        top: "auto", // Reset top
      };
    }

    return style;
  };

  // Render nilai pada input
  const inputValue = useMemo(() => {
    const useCommitted = showActions;
    if (activeMode === "single") {
      const src = useCommitted ? committedSingle : singleDate;
      return src ? formatDateToIndonesian(src) : "";
    }
    if (activeMode === "multiple") {
      const src = Array.from(useCommitted ? committedMultiple : multipleDates);
      return src.length ? src.map((d) => formatDateToIndonesian(d)).join(", ") : "";
    }
    if (activeMode === "range") {
      const s = useCommitted ? committedRangeStart : rangeStart;
      const e = useCommitted ? committedRangeEnd : rangeEnd;
      if (s && e) {
        return `${formatDateToIndonesian(s)} – ${formatDateToIndonesian(e)}`;
      }
      return s ? formatDateToIndonesian(s) : "";
    }
    // time
    const hh = String(useCommitted ? committedTimeHour : timeHour).padStart(2, "0");
    const mm = String(useCommitted ? committedTimeMinute : timeMinute).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [activeMode, singleDate, multipleDates, rangeStart, rangeEnd, timeHour, timeMinute, showActions, committedSingle, committedMultiple, committedRangeStart, committedRangeEnd, committedTimeHour, committedTimeMinute]);

  // Sinkronisasi bulan kalender saat popup dibuka berdasarkan tanggal terpilih
  const getReferenceDate = (): Date | null => {
    if (activeMode === "single" && singleDate) {
      return parseISOToDate(singleDate);
    }
    if (activeMode === "range" && rangeStart) {
      return parseISOToDate(rangeStart);
    }
    if (activeMode === "multiple" && multipleDates.size > 0) {
      const first = Array.from(multipleDates)[0];
      return parseISOToDate(first);
    }
    return null;
  };
  useEffect(() => {
    if (isOpen) {
      const ref = getReferenceDate();
      if (ref) {
        setCurrentMonth(new Date(ref.getFullYear(), ref.getMonth()));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Klik hari pada kalender
  const handleDateClick = (year: number, month: number, day: number) => {
    const selected = fmtYMD(year, month, day);
    if (activeMode === "single") {
      setSingleDate(selected);
      setCurrentMonth(new Date(year, month));
      if (!showActions) {
        const d = parseISOToDate(selected);
        if (onChange) onChange(d ? [d] : [], selected);
        setIsOpen(false);
      }
    } else if (activeMode === "multiple") {
      setMultipleDates((prev) => {
        const next = new Set(prev);
        if (next.has(selected)) next.delete(selected);
        else next.add(selected);
        return next;
      });
      if (!showActions) {
        const arrDates = Array.from(multipleDates)
          .map((d) => parseISOToDate(d))
          .filter((d): d is Date => !!d);
        const isoStr = Array.from(multipleDates).join(", ");
        if (onChange) onChange(arrDates, isoStr);
      }
    } else if (activeMode === "range") {
      if (selectingStartDate) {
        setRangeStart(selected);
        if (rangeEnd && selected > rangeEnd) {
          setRangeEnd("");
        }
        setSelectingStartDate(false);
        setCurrentMonth(new Date(year, month));
      } else {
        if (selected >= rangeStart) {
          setRangeEnd(selected);
          setSelectingStartDate(true);
        } else {
          setRangeStart(selected);
          setRangeEnd("");
        }
        setCurrentMonth(new Date(year, month));
        if (!showActions) {
          const start = parseISOToDate(rangeStart || selected);
          const end = parseISOToDate(selected);
          const arr: Date[] = [];
          if (start) arr.push(start);
          if (end) arr.push(end);
          const isoStr = [rangeStart || selected, selected].filter(Boolean).join(" to ");
          if (onChange) onChange(arr, isoStr);
        }
      }
    }
  };

  // Navigasi bulan
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowMonthYearPicker(false);
  };
  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
  };

  // Bantu cek status highlight
  const isSameDate = (dateStr: string, year: number, month: number, day: number): boolean => {
    if (!dateStr) return false;
    const y = Number(dateStr.slice(0, 4));
    const m = Number(dateStr.slice(5, 7)) - 1;
    const d = Number(dateStr.slice(8, 10));
    return y === year && m === month && d === day;
  };
  const isInRange = (year: number, month: number, day: number): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    const cur = fmtYMD(year, month, day);
    return cur >= rangeStart && cur <= rangeEnd;
  };

  // Render kalender
  const renderCalendar = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthNamesFull = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

    const days: React.ReactNode[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isStartDate = activeMode === "range" && isSameDate(rangeStart, year, month, day);
      const isEndDate = activeMode === "range" && isSameDate(rangeEnd, year, month, day);
      const inRange = activeMode === "range" && isInRange(year, month, day);
      const isMultiSelected = activeMode === "multiple" && multipleDates.has(fmtYMD(year, month, day));
      const isSingleSelected = activeMode === "single" && isSameDate(singleDate, year, month, day);
      const active = isStartDate || isEndDate || isMultiSelected || isSingleSelected;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(year, month, day)}
          className={`
            h-8 w-8 rounded-full text-sm flex items-center justify-center
            ${active ? "bg-[#004969] text-white font-medium" : ""}
            ${inRange && !isStartDate && !isEndDate ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30" : ""}
            ${!active && !inRange ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        {/* Navigasi bulan/tahun */}
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <span className="text-gray-600 dark:text-gray-400">{/* << */}‹</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
            className="text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded transition-colors"
          >
            {monthNames[month]} {year}
          </button>
          <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <span className="text-gray-600 dark:text-gray-400">{/* >> */}›</span>
          </button>
        </div>

        {showMonthYearPicker ? (
          <div className="mb-3">
            {/* Tahun */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => handleYearChange(year - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">‹</span>
                </button>
                {editingYear ? (
                  <input
                    type="number"
                    value={yearInput || String(year)}
                    onChange={(e) => setYearInput(e.target.value.slice(0, 4))}
                    onBlur={() => {
                      const ny = parseInt(yearInput || String(year), 10);
                      if (!isNaN(ny) && ny > 0) handleYearChange(ny);
                      setEditingYear(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const ny = parseInt(yearInput || String(year), 10);
                        if (!isNaN(ny) && ny > 0) handleYearChange(ny);
                        setEditingYear(false);
                      } else if (e.key === "Escape") {
                        setEditingYear(false);
                        setYearInput("");
                      }
                    }}
                    className="w-20 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setYearInput(String(year));
                      setEditingYear(true);
                    }}
                    className="text-sm font-medium text-gray-900 dark:text-white px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {year}
                  </button>
                )}
                <button type="button" onClick={() => handleYearChange(year + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">›</span>
                </button>
              </div>
            </div>
            {/* Bulan */}
            <div className="grid grid-cols-3 gap-2">
              {monthNamesFull.map((monthName, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMonthChange(idx)}
                  className={`
                    px-3 py-2 text-xs rounded transition-colors
                    ${idx === month ? "bg-[#004969] text-white font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}
                  `}
                >
                  {monthName}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Nama hari */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-[10px] text-center font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            {/* Hari bulan */}
            <div className="grid grid-cols-7 gap-1">{days}</div>
          </>
        )}
      </div>
    );
  };

  // Render konten time-only
  const renderTimePicker = () => {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Jam</label>
            <select
              value={timeHour}
              onChange={(e) => setTimeHour(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Menit</label>
            <select
              value={timeMinute}
              onChange={(e) => setTimeMinute(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  // Apply & Reset
  const handleApply = () => {
    if (!onChange) {
      setIsOpen(false);
      return;
    }
    if (activeMode === "single") {
      const d = parseISOToDate(singleDate);
      const isoStr = singleDate || "";
      if (showActions) setCommittedSingle(singleDate || "");
      onChange(d ? [d] : [], isoStr);
    } else if (activeMode === "multiple") {
      const arrDates = Array.from(multipleDates)
        .map((d) => parseISOToDate(d))
        .filter((d): d is Date => !!d);
      const isoStr = Array.from(multipleDates).join(", ");
      if (showActions) setCommittedMultiple(new Set(multipleDates));
      onChange(arrDates, isoStr);
    } else if (activeMode === "range") {
      const start = parseISOToDate(rangeStart);
      const end = parseISOToDate(rangeEnd);
      const arr: Date[] = [];
      if (start) arr.push(start);
      if (end) arr.push(end);
      const isoStr = [rangeStart, rangeEnd].filter(Boolean).join(" to ");
      if (showActions) {
        setCommittedRangeStart(rangeStart || "");
        setCommittedRangeEnd(rangeEnd || "");
      }
      onChange(arr, isoStr);
    } else if (activeMode === "time") {
      const base = new Date();
      base.setHours(timeHour, timeMinute, 0, 0);
      const hh = String(timeHour).padStart(2, "0");
      const mm = String(timeMinute).padStart(2, "0");
      if (showActions) {
        setCommittedTimeHour(timeHour);
        setCommittedTimeMinute(timeMinute);
      }
      onChange([base], `${hh}:${mm}`);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setSingleDate("");
    setMultipleDates(new Set());
    setRangeStart("");
    setRangeEnd("");
    setSelectingStartDate(true);
    if (showActions) {
      setCommittedSingle("");
      setCommittedMultiple(new Set());
      setCommittedRangeStart("");
      setCommittedRangeEnd("");
      setCommittedTimeHour(timeHour);
      setCommittedTimeMinute(timeMinute);
    }
    if (onChange) onChange([], "");
    setIsOpen(false);
  };

  // Dokumentasi: Handler untuk toggle end date (Switch)
  // Menyinkronkan data antara single dan range saat berpindah mode
  const handleToggleRange = (checked: boolean) => {
    setIsRangeMode(checked);
    if (checked) {
        // Switch Single -> Range
        // Gunakan tanggal single sebagai start date jika ada
        if (singleDate) {
            setRangeStart(singleDate);
            setRangeEnd(""); 
            setSelectingStartDate(false); // User diharapkan memilih end date selanjutnya
        }
    } else {
        // Switch Range -> Single
        // Gunakan start date range sebagai single date jika ada
        if (rangeStart) {
            setSingleDate(rangeStart);
        }
    }
  };

  return (
    <div className={className}>
      {label && !hideInput && <Label htmlFor={id}>{label}</Label>}
      {!hideInput && (
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          value={inputValue}
          onClick={() => {
            if (!disabled) setIsOpen(true);
          }}
          className="h-11 w-full rounded-lg border appearance-none px-4 pr-12 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800 dark:focus:ring-brand-800/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
      )}

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed z-50 flex flex-col gap-2"
          style={getPosition()}
        >
          {/* Main Calendar Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-16px)] overflow-auto">
            {/* Input display (range gunakan 2 kolom) */}
            {activeMode !== "time" && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  {(activeMode === "single" || activeMode === "range") && (
                    <input
                      type="text"
                      value={formatDateToIndonesian(activeMode === "single" ? singleDate : rangeStart)}
                      readOnly
                      placeholder="Feb 22, 2025"
                      className="flex-1 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer w-full text-center"
                      onClick={() => activeMode === "range" && setSelectingStartDate(true)}
                    />
                  )}
                  {activeMode === "range" && (
                    <input
                      type="text"
                      value={formatDateToIndonesian(rangeEnd)}
                      readOnly
                      placeholder="Feb 27, 2025"
                      className="flex-1 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer w-full text-center"
                      onClick={() => setSelectingStartDate(false)}
                    />
                  )}
                  {activeMode === "multiple" && (
                    <input
                      type="text"
                      value={inputValue}
                      readOnly
                      placeholder="Pilih tanggal"
                      className="flex-1 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default w-full text-center"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Konten popup */}
            {activeMode === "time" ? renderTimePicker() : renderCalendar()}

            {/* Tombol aksi */}
            {showActions && (
              <div className="flex gap-2 px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={handleReset} variant="outline" size="sm" className="flex-1">
                  Reset
                </Button>
                <Button onClick={handleApply} variant="primary" size="sm" className="flex-1">
                  Simpan
                </Button>
              </div>
            )}
          </div>

          {/* Toggle End Date - Ditampilkan dalam "card" terpisah di bawah kalender */}
          {showEndDateToggle && (
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">End date</span>
                <Switch label="" defaultChecked={isRangeMode} onChange={handleToggleRange} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
