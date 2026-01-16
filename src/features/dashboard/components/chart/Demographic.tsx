import BarChartTwo from "../../../../components/charts/bar/BarChartTwo";
import { useDemographic } from "../../hooks/chart/useDemographic";

export default function Demographic() {
  const { series } = useDemographic();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Jumlah Karyawan Keluar</h4>
      </div>
      <BarChartTwo series={series} />
    </div>
  );
}
