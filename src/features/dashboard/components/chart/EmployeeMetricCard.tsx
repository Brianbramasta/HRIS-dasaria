import Badge from "../../../../components/ui/badge/Badge";
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: number | string;
  icon: ReactNode;
  badgeText?: string;
  badgeColor?: "success" | "error" | "warning" | "primary";
};

export default function EmployeeMetricCard({
  title,
  value,
  icon,
  badgeText = "+12.90%",
  badgeColor = "success",
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        </div>
        <Badge color={badgeColor}>{badgeText}</Badge>
      </div>
    </div>
  );
}