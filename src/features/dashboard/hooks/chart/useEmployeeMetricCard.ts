export type BadgeColor = "success" | "error" | "warning" | "primary";

export function useEmployeeMetricCard(params?: {
  badgeText?: string;
  badgeColor?: BadgeColor;
}) {
  const badgeText = params?.badgeText ?? "+12.90%";
  const badgeColor: BadgeColor = params?.badgeColor ?? "success";
  return { badgeText, badgeColor };
}
