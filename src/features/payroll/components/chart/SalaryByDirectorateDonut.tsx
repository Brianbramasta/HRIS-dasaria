import PieChartOne from "@/components/charts/pie/PieChartOne";
import useSalaryByDirectorateDonut from "@/features/payroll/hooks/chart/useSalaryByDirectorateDonut";

export default function SalaryByDirectorateDonut() {
  const { labels, series, colors } = useSalaryByDirectorateDonut();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Gaji per Direktorat
        </h5>
      </div>

      <div className="relative w-full flex-1 flex items-center">
        <PieChartOne
          labels={labels}
          series={series}
          colors={colors}
          height={320}
          width="100%"
          donutSize="68%"
          showLegend
          className="w-full"
        />
      </div>
    </div>
  );
}
