import PieChartOne from "../../../../components/charts/pie/PieChartOne";

export default function StatusKepegawaian() {
  const labels = ["PKWT", "PKWTT", "MITRA"];
  const series = [197.27, 184.69, 94.47];
  const colors = ["#1f6af7", "#0c3a87", "#cfe0ff"];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full flex flex-col items-center justify-center">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Status Kepegawaian</h3>
      </div>
      <div className="relative w-full">
          <PieChartOne
            labels={labels}
            series={series}
            colors={colors}
            totalValue={674.71}
            height={340}
            width="100%"
            showLegend
            className="w-full"
          />
      </div>
    </div>
  );
}
