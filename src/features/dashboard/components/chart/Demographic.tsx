import BarChartTwo, { BarSeries } from "../../../../components/charts/bar/BarChartTwo";

export default function Demographic() {
  const series: BarSeries[] = [
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
    }
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Jumlah Karyawan Keluar</h3>
        {/* <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Number of customer based on</p> */}
      </div>
      <BarChartTwo series={series} />
    </div>
  );
}
