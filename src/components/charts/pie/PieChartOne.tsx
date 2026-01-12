import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type PieChartOneProps = {
  labels: string[];
  series: number[];
  colors?: string[];
  height?: number | string;
  width?: number | string;
  donutSize?: string;
  showLegend?: boolean;
  totalValue?: number;
  valueFormat?: "value" | "percent";
  tooltipValueFormat?: "value" | "percent";
  className?: string;
};

export default function PieChartOne({
  labels,
  series,
  colors = ["#3641f5", "#1976ff", "#dde9ff"],
  height = 320,
  width = "100%",
  donutSize = "65%",
  showLegend = false,
  totalValue,
  valueFormat = "value",
  tooltipValueFormat,
  className,
}: PieChartOneProps) {
  const resolvedTooltipValueFormat = tooltipValueFormat ?? valueFormat;
  const sum = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    colors,
    labels,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: typeof height === "number" ? height : undefined,
      width: typeof width === "number" ? width : undefined,
    },
    plotOptions: {
      pie: {
        donut: {
          size: donutSize,
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: -10,
              formatter: (val) => `${val ?? ""}`,
            },
            value: {
              show: true,
              offsetY: 10,
              formatter: (val) => {
                if (valueFormat === "percent") {
                  if (!sum) return "0%";
                  const percent = (Number(val) / sum) * 100;
                  return `${percent.toFixed(0)}%`;
                }
                return `${val}`;
              },
            },
            total: {
              show: true,
              label: "",
              formatter: () => {
                if (typeof totalValue === "number") return `${totalValue}`;
                return `${sum}`;
              },
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "light",
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => {
          if (resolvedTooltipValueFormat === "percent") {
            if (!sum) return "0%";
            const percent = (val / sum) * 100;
            return `${percent.toFixed(0)}%`;
          }
          return val.toFixed(2);
        },
      },
    },
    stroke: {
      show: false,
      width: 4,
    },
    legend: {
      show: showLegend,
      position: "right",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 6,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height, width },
        },
      },
    ],
  };
  return (
    <div className={className ? className : "w-full"}>
      <div id="chartDarkStyle" className="w-full">
        <Chart options={options} series={series} type="donut" height={height} width={width} />
      </div>
    </div>
  );
}
