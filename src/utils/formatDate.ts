export function formatDate(value: string | Date): string {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    const mm = String(value.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(value.getUTCDate()).padStart(2, "0");
    const yyyy = value.getUTCFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[2]}/${m[3]}/${m[1]}`;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  return "";
}

export default formatDate;
