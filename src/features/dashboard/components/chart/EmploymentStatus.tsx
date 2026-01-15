import PieChartOne from "../../../../components/charts/pie/PieChartOne";
import { useEmploymentStatus } from "../../hooks/chart/useEmploymentStatus";

export default function StatusKepegawaian() {
  const { labels, series, colors, totalValue } = useEmploymentStatus();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full flex flex-col items-start justify-center">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">Status Kepegawaian</h5>
      </div>
      <div className="relative w-full">
          <PieChartOne
            labels={labels}
            series={series}
            colors={colors}
            totalValue={totalValue}
            height={340}
            width="100%"
            showLegend
            className="w-full"
          />
      </div>
    </div>
  );
}
