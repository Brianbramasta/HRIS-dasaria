import { useMemo } from "react";
import { ApexOptions } from "apexcharts";

export function useEmployeeEngagement() {
  const series = useMemo(() => [75], []);

  const options: ApexOptions = useMemo(
    () => ({
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
    }),
    []
  );

  return { series, options };
}
