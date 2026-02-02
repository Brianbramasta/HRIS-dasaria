import { useMemo } from "react";

export function useEmploymentStatus() {
  const labels = useMemo(() => ["PKWT", "PKWTT", "MITRA"], []);
  const series = useMemo(() => [197.27, 184.69, 94.47], []);
  const colors = useMemo(() => ["#1f6af7", "#0c3a87", "#cfe0ff"], []);
  const totalValue = 674.71;
  return { labels, series, colors, totalValue };
}
