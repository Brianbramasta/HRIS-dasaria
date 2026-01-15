import StatisticsChart from "../../../../components/ecommerce/StatisticsChart";
import { useStatistic } from "../../hooks/chart/useStatistic";

export default function Statistik() {
  const { period, setPeriod, series, categories, tabOptions, colors } = useStatistic();

  return (
    <StatisticsChart
      title="Grafik Fluktuasi Karyawan"
      desc=""
      series={series}
      categories={categories}
      colors={colors}
      // curve="smooth"
      tabOptions={tabOptions}
      selectedTab={period}
      onTabChange={(id) => setPeriod(id as typeof period)}
    />
  );
}
