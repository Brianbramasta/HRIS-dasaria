

import EmployeeFluctuationPanel from "../../components/chart/EmployeeFluctuationPanel";
import MonthlySalaryPanel from "../../components/chart/MonthlySalaryPanel";
import ReportPeriodPanel from "../../components/chart/ReportPeriodPanel";

export default function DashboardPayrollPage() {
  return (
    <div className="space-y-6">
      <h3>Dashboard Penggajian</h3>
      <ReportPeriodPanel />
      <MonthlySalaryPanel />
      <EmployeeFluctuationPanel />
    </div>
  );
}
