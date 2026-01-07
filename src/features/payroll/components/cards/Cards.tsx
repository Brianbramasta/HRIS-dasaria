// Dokumentasi: Komponen kartu khusus untuk fitur Penggajian
// Menyediakan header berwarna sesuai desain dan slot aksi kanan.
import React from "react";
import { twMerge } from "tailwind-merge";

type HeaderColor = "gray" | "green" | "red" | "slate" | "blue";

interface PayrollCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  headerColor?: HeaderColor;
  rightSlot?: React.ReactNode;
}

// Dokumentasi: Map warna header agar konsisten pada mode gelap/terang
const headerColorClasses: Record<HeaderColor, string> = {
  gray: "bg-gray-600 text-white dark:bg-gray-700",
  green: "bg-green-700 text-white dark:bg-green-800",
  red: "bg-red-700 text-white dark:bg-red-800",
  slate: "bg-slate-700 text-white dark:bg-slate-800",
  blue: "bg-blue-600 text-white dark:bg-blue-700",
};

// Dokumentasi: Kartu Penggajian dengan header berwarna dan body ber-border
const PayrollCard: React.FC<PayrollCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerColor = "gray",
  rightSlot,
}) => {
  return (
    <div
      className={twMerge(
        "rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]",
        className
      )}
    >
      <div
        className={twMerge(
          "flex items-center justify-between px-6 py-4 m-4 rounded-t-md",
          headerColorClasses[headerColor]
        )}
      >
        <div>
          <h5 className="text-base font-medium">{title}</h5>
          {desc && (
            <p className="mt-0.5 text-xs opacity-80">{desc}</p>
          )}
        </div>
        {rightSlot && <div className="ml-3">{rightSlot}</div>}
      </div>

      <div className="p-6 bg-white dark:bg-white/[0.03]">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default PayrollCard;

