import { useState, useMemo } from "react";
import StatisticsChart, { LineSeries } from "../../../../components/ecommerce/StatisticsChart";

export default function Statistik() {
  const [period, setPeriod] = useState<"bulanan" | "kuartalan" | "tahunan">("bulanan");

  const { series, categories } = useMemo(() => {
    if (period === "kuartalan") {
      return {
        categories: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { name: "Karyawan Masuk", data: [40, 52, 30, 28] },
          { name: "Karyawan Keluar", data: [135, 132, 99, 103] },
        ] as LineSeries[],
      };
    }
    if (period === "tahunan") {
      return {
        categories: ["2021", "2022", "2023", "2024", "2025"],
        series: [
          { name: "Karyawan Masuk", data: [180, 220, 240, 260, 300] },
          { name: "Karyawan Keluar", data: [420, 400, 380, 360, 340] },
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
        "AGT",
        "SEP",
        "OKT",
        "NOV",
        "DES",
      ],
      series: [
        { name: "Karyawan Masuk", data: [12, 18, 10, 20, 14, 26, 12, 12, 10, 9, 8, 11] },
        { name: "Karyawan Keluar", data: [45, 48, 42, 47, 50, 38, 35, 34, 28, 30, 33, 40] },
      ] as LineSeries[],
    };
  }, [period]);

  const tabOptions = [
    { id: "bulanan", label: "Bulanan" },
    { id: "kuartalan", label: "Kuartalan" },
    { id: "tahunan", label: "Tahunan" },
  ];

  return (
    <StatisticsChart
      title="Grafik Fluktuasi Karyawan"
      desc=""
      series={series}
      categories={categories}
      colors={["#2a31d8", "#c2d6ff"]}
      // curve="smooth"
      tabOptions={tabOptions}
      selectedTab={period}
      onTabChange={(id) => setPeriod(id as typeof period)}
    />
  );
}
