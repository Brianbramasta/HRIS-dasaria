import React from 'react';

/**
 * Parse Indonesian date format to Date object
 * Handles both ISO format and Indonesian format (e.g., "1 Januari 2024")
 */
export const parseIndonesianDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  const trimmed = (dateStr || '').trim();
  const isoCandidate = new Date(trimmed);
  if (!isNaN(isoCandidate.getTime())) return isoCandidate;
  
  const months: Record<string, number> = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };
  
  const parts = trimmed.split(/\s+/);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
};

/**
 * Render badge component for remaining contract days
 * Returns JSX element with appropriate styling based on remaining time
 */
export const renderSisaKontrakBadge = (endStr: string | null | undefined): React.ReactElement => {
  const end = parseIndonesianDate(endStr);
  if (!end) {
    return (
      <span className="inline-block rounded-full bg-gray-100 p-[10px] w-max text-xs font-medium text-gray-800">-</span>
    );
  }
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return (
      <span className="inline-block rounded-full bg-red-100 p-[10px] w-max text-xs font-medium text-red-800">Berakhir</span>
    );
  }
  if (diffDays <= 14) {
    const weeks = Math.max(1, Math.ceil(diffDays / 7));
    return (
      <span className="inline-block rounded-full bg-red-100 p-[10px] w-max text-xs font-medium text-red-800">{`${weeks} Minggu`}</span>
    );
  }
  if (diffDays <= 30) {
    return (
      <span className="inline-block rounded-full bg-yellow-100 p-[10px] w-max text-xs font-medium text-yellow-800">1 Bulan</span>
    );
  }
  const months = Math.floor(diffDays / 30);
  return (
    <span className="inline-block rounded-full bg-green-100 p-[10px] w-max text-xs font-medium text-green-800">{`${months} Bulan`}</span>
  );
};
