import PieChartOne from "@/components/charts/pie/PieChartOne";

export default function SalaryByDirectorateDonut() {
  const labels = ["IT", "Operation", "HR", "FAT", "Other"];
  const series = [15, 20, 10, 45, 10];
  const colors = ["#9CC7FF", "#4FA3D1", "#1E7AA7", "#0B5C7C", "#CFE0FF"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">Gaji per Direktorat</h5>
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

