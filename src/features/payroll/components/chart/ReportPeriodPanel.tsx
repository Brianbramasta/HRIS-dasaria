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
          <svg
            width="45"
            height="45"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_376_17051)">
              <path
                d="M22.7832 29.5298C22.7832 27.0763 24.1326 24.8681 26.0954 23.7641C24.5006 23.1507 22.5378 22.7827 20.3296 22.7827C14.9319 22.7827 10.5156 24.9908 10.5156 27.6897V30.1432H22.7832V29.5298ZM29.5303 25.2362C27.1995 25.2362 25.2367 27.199 25.2367 29.5298C25.2367 31.8606 27.1995 33.8234 29.5303 33.8234C31.8611 33.8234 33.8239 31.8606 33.8239 29.5298C33.8239 27.199 31.8611 25.2362 29.5303 25.2362ZM25.2367 15.4221C25.2367 18.121 23.0285 20.3292 20.3296 20.3292C17.6308 20.3292 15.4226 18.121 15.4226 15.4221C15.4226 12.7233 17.6308 10.5151 20.3296 10.5151C23.0285 10.5151 25.2367 12.7233 25.2367 15.4221Z"
                fill="#242425"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_376_17051"
                x="-3.06581"
                y="-3.06678"
                width="50.4715"
                height="50.4719"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.25751" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_376_17051"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_376_17051"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        ),
      },
      {
        key: "totalPayrollCost",
        title: "Total Biaya Gaji",
        value: metricData.totalPayrollCost.value,
        icon: (
          <svg
            width="45"
            height="48"
            viewBox="0 0 45 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_376_17060)">
              <path
                d="M31.9803 24.9263C32.8418 23.688 33.3618 22.2445 33.4881 20.7413C33.6144 19.2381 33.3425 17.7281 32.6998 16.3634C32.057 14.9987 31.0661 13.8273 29.8267 12.9673C28.5874 12.1073 27.1433 11.5889 25.6399 11.4644C24.1366 11.3398 22.6269 11.6135 21.2629 12.2579C19.899 12.9023 18.7288 13.8946 17.8702 15.135C17.0117 16.3753 16.495 17.82 16.3722 19.3235C16.2495 20.827 16.5249 22.3364 17.1709 23.6996"
                stroke="#242425"
                stroke-width="1.84013"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24.9301 16.3391C23.5745 16.3391 22.4766 17.1634 22.4766 18.1792C22.4766 19.1949 23.5745 20.0193 24.9301 20.0193C26.2856 20.0193 27.3836 20.8437 27.3836 21.8594C27.3836 22.8752 26.2856 23.6996 24.9301 23.6996M24.9301 16.3391C25.9973 16.3391 26.9076 16.8506 27.2437 17.5658M24.9301 16.3391V15.1123M24.9301 23.6996C23.8628 23.6996 22.9525 23.188 22.6164 22.4728M24.9301 23.6996V24.9263"
                stroke="#242425"
                stroke-width="1.84013"
                stroke-linecap="round"
              />
              <path
                d="M11.4375 26.1528H14.3756C14.7362 26.1528 15.092 26.2338 15.4146 26.3908L17.9197 27.6029C18.2423 27.7587 18.5981 27.8396 18.9599 27.8396H20.2382C21.4748 27.8396 22.4783 28.81 22.4783 30.0073C22.4783 30.0564 22.4452 30.0981 22.3973 30.1116L19.2801 30.974C18.7208 31.1285 18.1244 31.0744 17.6019 30.8219L14.9239 29.5264M22.4783 29.2197L28.1128 27.4888C28.6033 27.3383 29.1288 27.3465 29.6144 27.5124C30.0999 27.6783 30.5206 27.9933 30.8165 28.4125C31.2692 29.0382 31.0852 29.9361 30.4252 30.3164L21.2061 35.6369C20.9179 35.8036 20.5987 35.91 20.268 35.9494C19.9373 35.9889 19.602 35.9606 19.2826 35.8663L11.4375 33.5379"
                stroke="#242425"
                stroke-width="1.84013"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_376_17060"
                x="-2.75721"
                y="-1.53505"
                width="50.4715"
                height="50.4719"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.25751" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_376_17060"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_376_17060"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        ),
      },
      {
        key: "avgSalary",
        title: "Rerata Gaji Karyawan",
        value: metricData.avgSalary.value,
        icon: (
          <svg
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9335 7.83203C14.0741 7.83203 15.8119 9.56985 15.8119 11.7104C15.8119 13.851 14.0741 15.5888 11.9335 15.5888C9.79294 15.5888 8.05512 13.851 8.05512 11.7104C8.05512 9.56985 9.79294 7.83203 11.9335 7.83203ZM3.58005 10.5171C5.06428 10.5171 6.26509 11.7179 6.26509 13.2021C6.26509 14.6863 5.06428 15.8872 3.58005 15.8872C2.09582 15.8872 0.895013 14.6863 0.895013 13.2021C0.895013 11.7179 2.09582 10.5171 3.58005 10.5171ZM0 22.7489C0 20.1124 2.13684 17.9755 4.7734 17.9755C5.25075 17.9755 5.71317 18.0464 6.14949 18.1769C4.92257 19.5492 4.17673 21.3617 4.17673 23.3456V23.9423C4.17673 24.3674 4.26623 24.7702 4.42659 25.1356H1.19335C0.533279 25.1356 0 24.6023 0 23.9423V22.7489ZM19.4404 25.1356C19.6008 24.7702 19.6903 24.3674 19.6903 23.9423V23.3456C19.6903 21.3617 18.9444 19.5492 17.7175 18.1769C18.1539 18.0464 18.6163 17.9755 19.0936 17.9755C21.7302 17.9755 23.867 20.1124 23.867 22.7489V23.9423C23.867 24.6023 23.3337 25.1356 22.6737 25.1356H19.4404ZM17.6019 13.2021C17.6019 11.7179 18.8027 10.5171 20.287 10.5171C21.7712 10.5171 22.972 11.7179 22.972 13.2021C22.972 14.6863 21.7712 15.8872 20.287 15.8872C18.8027 15.8872 17.6019 14.6863 17.6019 13.2021ZM5.96676 23.3456C5.96676 20.049 8.63688 17.3788 11.9335 17.3788C15.2301 17.3788 17.9003 20.049 17.9003 23.3456V23.9423C17.9003 24.6023 17.367 25.1356 16.7069 25.1356H7.16011C6.50003 25.1356 5.96676 24.6023 5.96676 23.9423V23.3456Z"
              fill="black"
            />
            <path
              d="M5.152 0.63682L5.15195 0.263898L5.152 0.63682ZM3.66049 2.13213L3.28757 2.13304L3.66049 2.13213ZM3.41128 8.09631C3.55727 8.24159 3.79339 8.24102 3.93867 8.09503L6.30616 5.71601C6.45144 5.57002 6.45087 5.3339 6.30488 5.18861C6.15889 5.04333 5.92277 5.04391 5.77749 5.1899L3.67306 7.30458L1.55837 5.20015C1.41238 5.05487 1.17626 5.05544 1.03098 5.20143C0.8857 5.34742 0.886274 5.58354 1.03226 5.72882L3.41128 8.09631ZM7.37856 0.636555L7.37852 0.263632L5.15195 0.263898L5.152 0.63682L5.15204 1.00974L7.37861 1.00948L7.37856 0.636555ZM3.66049 2.13213L3.28757 2.13304L3.30142 7.83288L3.67434 7.83197L4.04726 7.83107L4.03341 2.13123L3.66049 2.13213ZM5.152 0.63682L5.15195 0.263898C4.12047 0.264021 3.28506 1.10156 3.28757 2.13304L3.66049 2.13213L4.03341 2.13123C4.03191 1.51234 4.53315 1.00982 5.15204 1.00974L5.152 0.63682Z"
              fill="black"
            />
            <path
              d="M18.6286 0.380118L18.6297 0.00719749L18.6286 0.380118ZM20.1156 1.86554L19.7427 1.86711L20.1156 1.86554ZM20.4055 8.09413C20.2604 8.24037 20.0243 8.24136 19.8781 8.09634L17.4949 5.73305C17.3486 5.58803 17.3476 5.35191 17.4927 5.20566C17.6377 5.05942 17.8738 5.05843 18.0201 5.20345L20.1385 7.30415L22.2392 5.18576C22.3842 5.03951 22.6203 5.03852 22.7665 5.18355C22.9128 5.32857 22.9138 5.56469 22.7688 5.71093L20.4055 8.09413ZM16.4085 0.373302L16.4097 0.000381495L18.6297 0.00719749L18.6286 0.380118L18.6274 0.753038L16.4074 0.746222L16.4085 0.373302ZM20.1156 1.86554L20.4886 1.86398L20.5136 7.82998L20.1407 7.83154L19.7677 7.8331L19.7427 1.86711L20.1156 1.86554ZM18.6286 0.380118L18.6297 0.00719749C19.6542 0.010343 20.4843 0.839479 20.4886 1.86398L20.1156 1.86554L19.7427 1.86711C19.7402 1.25241 19.2421 0.754926 18.6274 0.753038L18.6286 0.380118Z"
              fill="black"
            />
          </svg>
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
          <svg
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_376_17073)">
              <path
                d="M29.8983 35.2951L26.4634 31.6148L27.9355 30.1427L29.8983 32.1055L34.3146 27.6892L35.7867 29.4066L29.8983 35.2951ZM24.0099 21.5554H20.3296V30.1427H22.9058C23.0285 29.1613 23.5192 28.1799 24.0099 27.3212V21.5554ZM27.6902 21.5554V24.377C28.4262 24.1316 29.2849 24.0089 30.1437 24.0089C30.5117 24.0089 31.0024 24.0089 31.3704 24.1316V21.5554H27.6902ZM22.9058 32.5962H10.5156V36.2765H24.6233C23.7646 35.2951 23.1512 33.9456 22.9058 32.5962ZM33.8239 16.6484L22.1698 10.5146L10.5156 16.6484V19.1019H33.8239V16.6484ZM16.6494 30.1427V21.5554H12.9691V30.1427H16.6494Z"
                fill="#242425"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_376_17073"
                x="-2.08534"
                y="-1.84022"
                width="50.4715"
                height="50.4724"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.25751" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_376_17073"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_376_17073"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        ),
      },
    ],
    [metricData]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
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
