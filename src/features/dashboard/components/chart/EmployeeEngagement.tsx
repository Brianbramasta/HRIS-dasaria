import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../icons";

export default function EmployeeEngagement() {
  const series = [75];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 260,
      sparkline: {
        enabled: true,
      },
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            show: true,
            fontSize: "44px",
            fontWeight: 700,
            offsetY: -15,
            color: "#1D2939",
            formatter: (val) => `${Math.round(Number(val))}%`,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Engagement"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full">
      <div className="px-5 pt-5 pb-6 sm:px-6 sm:pt-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Survei Kepuasan Karyawan</h4>
        <div className="relative mt-4">
          <div id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={260} />
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[80%] text-sm font-semibold text-success-600 dark:text-success-500">
            10%
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300 sm:text-base">
          "Kerja bagus! Kenaikan kepuasan yang signifikan ini adalah prestasi, namun upaya retensi perlu diGolongankan."
        </p>

        <div className="mt-6 flex items-start justify-around px-2">
          <div className="text-center">
            <div className="text-gray-500 text-theme-sm dark:text-gray-400">Retensi</div>
            <div className="mt-2 flex items-center justify-center gap-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              50%
              <ArrowDownIcon className="text-error-600 size-4" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-theme-sm dark:text-gray-400">Golongan Pergantian</div>
            <div className="mt-2 flex items-center justify-center gap-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              50%
              <ArrowUpIcon className="text-success-600 size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}