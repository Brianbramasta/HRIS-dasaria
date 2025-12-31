import React from 'react';
import DatePicker from '../../../form/date-picker';

interface DateRangeFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string | null) => void;
  onReset: () => void;
  anchorEl?: HTMLElement | null;
  startDate?: string;
  endDate?: string | null;
}

// Dokumentasi: Menggunakan DatePicker dengan mode headless (popup-only) untuk menggantikan implementasi kalender manual.
// DatePicker menangani logika seleksi tanggal, toggle range/single, dan validasi.
export const DateRangeFilterPopup: React.FC<DateRangeFilterPopupProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  anchorEl,
  startDate,
  endDate,
}) => {
  if (!isOpen) return null;

  // Helper untuk format Date ke ISO string (YYYY-MM-DD)
  // Digunakan karena onChange DatePicker mengembalikan Date objects
  const toISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (selected: Date[]) => {
    // Jika array kosong, berarti reset atau tidak ada seleksi
    if (!selected || selected.length === 0) {
      // Panggil onReset jika user melakukan reset via DatePicker
      // Atau onApply kosong
      onReset(); 
      return;
    }

    const start = selected[0] ? toISO(selected[0]) : "";
    const end = selected[1] ? toISO(selected[1]) : null;

    if (start) {
      onApply(start, end);
    } else {
      onReset();
    }
  };

  // Konstruksi defaultDate berdasarkan props startDate dan endDate
  // Jika endDate ada, format object { from, to } agar terdeteksi sebagai range
  // Jika hanya startDate, format string agar terdeteksi sebagai single (default)
  // User dapat mengubah mode via toggle di dalam DatePicker
  const getDefaultDate = () => {
    if (startDate && endDate) {
      return { from: startDate, to: endDate };
    }
    if (startDate) {
      // Jika endDate null tapi kita ingin memberi hint bahwa ini mungkin range?
      // DatePicker akan otomatis set mode single jika input string.
      // Jika user sebelumnya memilih range tapi endDate kosong, DatePicker mungkin switch ke single.
      // Ini perilaku yang wajar.
      return startDate;
    }
    return undefined;
  };

  return (
    <DatePicker
      mode="range" // Mode default basis, tapi akan di-override oleh deteksi defaultDate + toggle
      isOpen={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      hideInput={true}
      showActions={true}
      showEndDateToggle={true}
      defaultDate={getDefaultDate()}
      onChange={handleDateChange}
    />
  );
};
