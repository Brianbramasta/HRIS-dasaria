import { useMemo, useState } from "react";
import { LineSeries } from "@/components/ecommerce/StatisticsChart";

export type Period = "monthly" | "quarterly" | "yearly";

export default function useEmployeeFluctuationPanel() {
  const [period, setPeriod] = useState<Period>("monthly");

  const { series, categories } = useMemo(() => {
    if (period === "quarterly") {
      return {
        categories: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { name: "Dasaria (Total)", data: [45, 52, 50, 42] },
          { name: "Dasarata", data: [28, 34, 30, 26] },
          { name: "Griyanet", data: [12, 20, 14, 10] },
        ] as LineSeries[],
      };
    }

    if (period === "yearly") {
      return {
        categories: ["2021", "2022", "2023", "2024", "2025"],
        series: [
          { name: "Dasaria (Total)", data: [180, 210, 240, 235, 260] },
          { name: "Dasarata", data: [120, 140, 155, 150, 170] },
          { name: "Griyanet", data: [80, 95, 110, 105, 120] },
        ] as LineSeries[],
      };
    }

    return {
      categories: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MEI",
        "JUN",
        "JUL",
        "AGU",
        "SEP",
        "OKT",
        "NOV",
        "DES",
      ],
      series: [
        {
          name: "Dasaria (Total)",
          data: [45, 47, 44, 48, 46, 50, 46, 46, 42, 42, 41, 44],
        },
        {
          name: "Dasarata",
          data: [12, 16, 10, 21, 13, 27, 12, 12, 12, 12, 8, 11],
        },
        {
          name: "Griyanet",
          data: [22, 24, 20, 33, 25, 40, 25, 25, 25, 25, 18, 22],
        },
      ] as LineSeries[],
    };
  }, [period]);

  const tabOptions = useMemo(
    () => [
      { id: "monthly", label: "Bulanan" },
      { id: "quarterly", label: "Kuartalan" },
      { id: "yearly", label: "Tahunan" },
    ],
    []
  );

  return {
    period,
    setPeriod,
    series,
    categories,
    tabOptions,
  };
}
