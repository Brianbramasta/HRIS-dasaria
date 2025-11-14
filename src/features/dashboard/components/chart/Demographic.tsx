import BarChartTwo from "../../../../components/charts/bar/BarChartTwo";

export default function Demographic() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Demographic</h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Number of customer based on</p>
      </div>
      <BarChartTwo />
    </div>
  );
}