import PieChartOne from "../../../../components/charts/pie/PieChartOne";

export default function StatusKepegawaian() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Status Kepegawaian</h3>
      </div>
      <PieChartOne />
    </div>
  );
}