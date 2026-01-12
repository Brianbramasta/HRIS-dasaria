import { useState } from "react";

export type PeriodType = "year" | "month";

export default function useReportPeriodPanel() {
  const [periodType, setPeriodType] = useState<PeriodType>("year");
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [isPeriodTypeOpen, setIsPeriodTypeOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(2020);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // In a real app, this data would be fetched based on the selected period
  const metricData = {
    activeEmployees: {
      value: 250,
      badgeText: "+12.90%",
      badgeColor: "success" as const,
    },
    totalPayrollCost: {
      value: "Rp. 500.000.000",
    },
    avgSalary: {
      value: "Rp. 4.000.000",
    },
    payrollStatus: {
      periodLabel: "Januari 2026",
      statusLabel: "Distribusi",
    },
  };

  return {
    periodType,
    setPeriodType,
    year,
    setYear,
    month,
    setMonth,
    isPeriodTypeOpen,
    setIsPeriodTypeOpen,
    isYearOpen,
    setIsYearOpen,
    yearRangeStart,
    setYearRangeStart,
    months,
    metricData,
  };
}
