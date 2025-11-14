import EmployeeMetricCard from "../components/chart/EmployeeMetricCard";
import { GroupIcon, BoxIconLine } from "@/icons";
import StatusKepegawaian from "../components/chart/StatusKepegawaian";
import Demographic from "../components/chart/Demographic";
import EmployeeEngagement from "../components/chart/EmployeeEngagement";
import Statistik from "../components/chart/Statistik";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top metrics and status section */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6">
        {/* Metrics grid */}
        <div className="xl:col-span-8">
          {(() => {
            const metrics = [
              {
                key: "active",
                title: "Active Employees",
                value: 250,
                icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
              },
              {
                key: "inactive",
                title: "Inactive Employees",
                value: 250,
                icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
              },
              {
                key: "garden",
                title: "On Garden Leave",
                value: 250,
                icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
              },
              {
                key: "onboarding",
                title: "Onboarding Employees",
                value: 250,
                icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
              },
            ];
            return (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {metrics.map((m) => (
                  <EmployeeMetricCard key={m.key} title={m.title} value={m.value} icon={m.icon} />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Status Kepegawaian (donut) */}
        <div className="xl:col-span-4">
          <StatusKepegawaian />
        </div>
      </div>

      {/* Demographic and Engagement */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6">
        <div className="xl:col-span-8">
          <Demographic />
        </div>
        <div className="xl:col-span-4">
          <EmployeeEngagement />
        </div>
      </div>

      {/* Statistik */}
      <div>
        <Statistik />
      </div>
    </div>
  );
}