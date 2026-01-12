import { useMemo, useState } from "react";
import { BarSeries } from "@/components/charts/bar/BarChartTwo";

export type Mode = "combined" | "basic";

export default function useMonthlySalaryPanel() {
  const [mode, setMode] = useState<Mode>("combined");
  const [year, setYear] = useState<number>(2026);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(2020);

  const categories = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agt",
      "Sept",
      "Okt",
      "Nov",
      "Des",
    ],
    []
  );

  const series = useMemo<BarSeries[]>(() => {
    if (mode === "basic") {
      return [
        {
          name: "Gaji Pokok",
          data: [28, 32, 22, 30, 18, 24, 28, 26, 14, 20, 26, 30],
        },
      ];
    }
    return [
      {
        name: "Gaji Pokok",
        data: [28, 30, 22, 28, 18, 24, 28, 26, 14, 20, 26, 30],
      },{
        name: "Tunjangan",
        data: [28, 30, 22, 28, 18, 24, 28, 26, 14, 20, 26, 30],
      },
      { name: "Overtime", data: [8, 6, 5, 10, 4, 7, 12, 9, 6, 8, 9, 10] },
      { name: "Insentif", data: [6, 5, 4, 8, 3, 4, 10, 7, 4, 6, 7, 8] },
      { name: "Komisi", data: [5, 6, 7, 6, 6, 8, 5, 6, 3, 5, 4, 6] },
    ];
  }, [mode]);

  return {
    mode,
    setMode,
    year,
    setYear,
    isModeOpen,
    setIsModeOpen,
    isYearOpen,
    setIsYearOpen,
    yearRangeStart,
    setYearRangeStart,
    categories,
    series,
  };
}
