import { useMemo } from "react";
import { BarSeries } from "@/components/charts/bar/BarChartTwo";

export function useDemographic() {
  const series: BarSeries[] = useMemo(
    () => [
      {
        name: "Resign",
        data: [44, 55, 41, 67, 22, 43, 55, 41],
      },
      {
        name: "PHK",
        data: [13, 23, 20, 8, 13, 27, 13, 23],
      },
      {
        name: "Habis Kontrak",
        data: [11, 17, 15, 15, 21, 14, 18, 20],
      },
    ],
    []
  );

  return { series };
}
