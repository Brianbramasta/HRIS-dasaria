import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import useEmployeeFluctuationPanel, {
  Period,
} from "@/features/payroll/hooks/chart/useEmployeeFluctuationPanel";

export default function EmployeeFluctuationPanel() {
  const { period, setPeriod, series, categories, tabOptions } =
    useEmployeeFluctuationPanel();

  return (
    <StatisticsChart
      title="Grafik Fluktuasi Karyawan"
      desc=""
      series={series}
      categories={categories}
      colors={["#22C55E", "#3B82F6", "#F97316"]}
      // curve="smooth"
      tabOptions={tabOptions}
      selectedTab={period}
      onTabChange={(id) => setPeriod(id as Period)}
      height={320}
    />
  );
}
