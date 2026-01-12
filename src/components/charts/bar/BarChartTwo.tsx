import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
export type BarSeries = { name: string; data: number[] };
interface BarChartTwoProps {
  series: BarSeries[];
  categories?: string[];
  colors?: string[];
  height?: number;
}
export default function BarChartTwo({
  series,
  categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  colors = ["#2a31d8", "#465fff", "#7592ff", "#c2d6ff"],
  height = 315,
}: BarChartTwoProps) {
  const options: ApexOptions = {
    colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      stacked: true,
      height,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 5,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    yaxis: {
      title: {
        text: undefined, // Hide the title by setting text to undefined
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => val.toString(), // Simplified formatter
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartSix" className="min-w-[1000px]">
        <Chart options={options} series={series} type="bar" height={height} />
      </div>
    </div>
  );
}
