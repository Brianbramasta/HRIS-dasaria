import { useMemo, type ReactNode } from "react";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import {
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import PayrollMetricCard from "@/features/payroll/components/chart/PayrollMetricCard";
import SalaryByDirectorateDonut from "@/features/payroll/components/chart/SalaryByDirectorateDonut";
import useReportPeriodPanel from "@/features/payroll/hooks/chart/useReportPeriodPanel";
import {
  IconReportActiveEmployees,
  IconReportAvgSalary,
  IconReportPayrollStatus,
  IconReportTotalPayrollCost,
} from "@/icons/components/icons";

type Metric = {
  key: string;
  title: string;
  value: ReactNode;
  icon: ReactNode;
  rightSlot?: ReactNode;
  badgeText?: string;
  badgeColor?: "success" | "error" | "warning" | "primary";
};

export default function ReportPeriodPanel() {
  const {
    periodType,
    setPeriodType,
    year,
    setYear,
    month,
    setMonth,
    isPeriodTypeOpen,
    setIsPeriodTypeOpen,
    isYearOpen,
    setIsYearOpen,
    yearRangeStart,
    setYearRangeStart,
    months,
    metricData,
  } = useReportPeriodPanel();

  const metrics = useMemo<Metric[]>(
    () => [
      {
        key: "activeEmployees",
        title: "Pegawai Aktif",
        value: metricData.activeEmployees.value,
        badgeText: metricData.activeEmployees.badgeText,
        badgeColor: metricData.activeEmployees.badgeColor,
        icon: (
          <IconReportActiveEmployees className="text-gray-800 dark:text-white/90" />
        ),
      },
      {
        key: "totalPayrollCost",
        title: "Total Biaya Gaji",
        value: metricData.totalPayrollCost.value,
        icon: (
          <IconReportTotalPayrollCost className="text-gray-800 dark:text-white/90" />
        ),
      },
      {
        key: "avgSalary",
        title: "Rerata Gaji Karyawan",
        value: metricData.avgSalary.value,
        icon: (
          <IconReportAvgSalary className="text-gray-800 dark:text-white/90" />
        ),
      },
      {
        key: "payrollStatus",
        title: "Status Payroll",
        value: <span>{metricData.payrollStatus.periodLabel}</span>,
        rightSlot: (
          <span className="inline-flex items-center rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-600 dark:bg-success-500/10 dark:text-success-400">
            {metricData.payrollStatus.statusLabel}
          </span>
        ),
        icon: (
          <IconReportPayrollStatus className="text-gray-800 dark:text-white/90" />
        ),
      },
    ],
    [metricData]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Periode Laporan
        </h4>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="relative">
            <Button
              onClick={() => setIsPeriodTypeOpen((v) => !v)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 dropdown-toggle"
            >
              {periodType === "year" ? "Tahun" : "Bulan"}
              <ChevronDown size={16} />
            </Button>
            <Dropdown
              isOpen={isPeriodTypeOpen}
              onClose={() => setIsPeriodTypeOpen(false)}
            >
              <div className="p-2 w-40">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setPeriodType("year");
                    setIsPeriodTypeOpen(false);
                  }}
                >
                  Tahun
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setPeriodType("month");
                    setIsPeriodTypeOpen(false);
                  }}
                >
                  Bulan
                </button>
              </div>
            </Dropdown>
          </div>

          <div className="relative">
            <Button
              onClick={() => setIsYearOpen((v) => !v)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 dropdown-toggle"
            >
              {periodType === "year" ? "Pilih Tahun" : "Pilih Bulan"}
              <Calendar size={16} />
            </Button>
            <Dropdown isOpen={isYearOpen} onClose={() => setIsYearOpen(false)}>
              {periodType === "year" ? (
                <div className="p-3 w-64">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setYearRangeStart((s) => s - 12)}
                      className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-semibold text-sm">
                      {yearRangeStart} - {yearRangeStart + 11}
                    </span>
                    <button
                      onClick={() => setYearRangeStart((s) => s + 12)}
                      className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const y = yearRangeStart + i;
                      return (
                        <button
                          key={y}
                          onClick={() => {
                            setYear(y);
                            setIsYearOpen(false);
                          }}
                          className={`px-2 py-1 text-sm rounded ${
                            year === y
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 w-64">
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMonth(i);
                          setIsYearOpen(false);
                        }}
                        className={`px-2 py-1 text-sm rounded ${
                          month === i
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Dropdown>
          </div>

          <Button size="sm" className="bg-brand-500 text-white">
            Search
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6 items-stretch">
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {metrics.map((m) => (
              <PayrollMetricCard
                key={m.key}
                title={m.title}
                value={m.value}
                icon={m.icon}
                rightSlot={m.rightSlot}
                badgeText={m.badgeText}
                badgeColor={m.badgeColor}
              />
            ))}
          </div>
          {/* <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Selected year: {year}</div> */}
        </div>

        <div className="xl:col-span-4 h-full">
          <SalaryByDirectorateDonut />
        </div>
      </div>
    </div>
  );
}
