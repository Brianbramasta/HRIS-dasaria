import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../ui/button/Button';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { formatDateToIndonesian } from '@/utils/formatDate';

interface DateRangeFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string | null) => void;
  onReset: () => void;
  anchorEl?: HTMLElement | null;
  startDate?: string;
  endDate?: string | null;
}

export const DateRangeFilterPopup: React.FC<DateRangeFilterPopupProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  anchorEl,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const [tempStartDate, setTempStartDate] = useState<string>(initialStartDate || '');
  const [tempEndDate, setTempEndDate] = useState<string>(initialEndDate || '');
  const [showEndDate, setShowEndDate] = useState<boolean>(!!initialEndDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(true);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempStartDate(initialStartDate || '');
    setTempEndDate(initialEndDate || '');
    setShowEndDate(!!initialEndDate);
  }, [initialStartDate, initialEndDate, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (tempStartDate) {
      onApply(tempStartDate, showEndDate ? tempEndDate || null : null);
      onClose();
    }
  };

  const handleReset = () => {
    setTempStartDate('');
    setTempEndDate('');
    setShowEndDate(false);
    onReset();
    onClose();
  };

  // Calculate position based on anchor element with boundary checks
  const getPosition = () => {
    if (!anchorEl) return {};
    const rect = anchorEl.getBoundingClientRect();
    const popupWidth = 280;
    const popupHeight = 450; // Approximate height
    const padding = 8;
    
    let top = rect.bottom + 4;
    let left = rect.left;
    
    // Check if popup would overflow right edge
    if (left + popupWidth > window.innerWidth - padding) {
      left = window.innerWidth - popupWidth - padding;
    }
    
    // Check if popup would overflow left edge
    if (left < padding) {
      left = padding;
    }
    
    // Check if popup would overflow bottom edge
    if (top + popupHeight > window.innerHeight - padding) {
      // Position above the anchor element instead
      top = rect.top - popupHeight - 4;
      // If still overflows, position at top with scroll
      if (top < padding) {
        top = padding;
      }
    }
    
    return {
      top,
      left,
    };
  };

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const formatDate = (year: number, month: number, day: number): string => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const parseDate = (dateStr: string): { year: number; month: number; day: number } | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]) - 1,
      day: parseInt(parts[2]),
    };
  };

  const isSameDate = (date1: string, year: number, month: number, day: number): boolean => {
    const parsed = parseDate(date1);
    if (!parsed) return false;
    return parsed.year === year && parsed.month === month && parsed.day === day;
  };

  const isInRange = (year: number, month: number, day: number): boolean => {
    if (!tempStartDate || !tempEndDate) return false;
    const currentDate = formatDate(year, month, day);
    return currentDate >= tempStartDate && currentDate <= tempEndDate;
  };

  const handleDateClick = (year: number, month: number, day: number) => {
    const selectedDate = formatDate(year, month, day);
    if (selectingStartDate) {
      setTempStartDate(selectedDate);
      if (showEndDate) {
        setSelectingStartDate(false);
      }
    } else {
      // Ensure end date is after start date
      if (selectedDate >= tempStartDate) {
        setTempEndDate(selectedDate);
        setSelectingStartDate(true);
      } else {
        // If clicked date is before start date, make it the new start date
        setTempStartDate(selectedDate);
        setTempEndDate('');
      }
    }
  };

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

  const renderCalendar = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthNamesFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isStartDate = isSameDate(tempStartDate, year, month, day);
      const isEndDate = showEndDate && isSameDate(tempEndDate, year, month, day);
      const inRange = showEndDate && isInRange(year, month, day);
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(year, month, day)}
          className={`
            h-8 w-8 rounded-full text-sm flex items-center justify-center
            ${isStartDate || isEndDate ? 'bg-[#004969] text-white font-medium' : ''}
            ${inRange && !isStartDate && !isEndDate ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30' : ''}
            ${!isStartDate && !isEndDate && !inRange ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
            className="text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded transition-colors"
          >
            {monthNames[month]} {year}
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {showMonthYearPicker ? (
          <div className="mb-3">
            {/* Year selector */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => handleYearChange(year - 1)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeft size={14} className="text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{year}</span>
                <button
                  type="button"
                  onClick={() => handleYearChange(year + 1)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronRight size={14} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-2">
              {monthNamesFull.map((monthName, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMonthChange(idx)}
                  className={`
                    px-3 py-2 text-xs rounded transition-colors
                    ${
                      idx === month
                        ? 'bg-[#004969] text-white font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {monthName}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-[10px] text-center font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">{days}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-16px)] overflow-auto"
      style={{ ...getPosition(), width: '310px' }}
    >
      {/* Date inputs display */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={formatDateToIndonesian(tempStartDate)}
            readOnly
            placeholder="Feb 22, 2025"
            className="flex-1 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer w-full"
            onClick={() => setSelectingStartDate(true)}
          />
          {showEndDate && (
            <input
              type="text"
              value={formatDateToIndonesian(tempEndDate)}
              readOnly
              placeholder="Feb 27, 2025"
              className="flex-1 text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer w-full"
              onClick={() => setSelectingStartDate(false)}
            />
          )}
        </div>
      </div>

      {/* Calendar */}
      {renderCalendar()}

      {/* End date toggle */}
      <div className="px-4 pb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={showEndDate}
              onChange={(e) => {
                setShowEndDate(e.target.checked);
                if (!e.target.checked) {
                  setTempEndDate('');
                  setSelectingStartDate(true);
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#004969]"></div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">end date</span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={handleReset} variant="outline" size="sm" className="flex-1">
          Reset
        </Button>
        <Button onClick={handleApply} variant="primary" size="sm" className="flex-1">
          Simpan
        </Button>
      </div>
    </div>
  );
};
