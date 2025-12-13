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

/**
 * Convert date from dd/mm/yyyy format to yyyy-mm-dd format
 * @param value - Date string in dd/mm/yyyy format
 * @returns Date string in yyyy-mm-dd format or empty string if invalid
 */
export function formatDateToISO(value: string): string {
  if (!value || typeof value !== "string") return "";
  
  // Match dd/mm/yyyy pattern
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  
  const [, dd, mm, yyyy] = match;
  
  // Validate date components
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  
  // Return in yyyy-mm-dd format
  return `${yyyy}-${mm}-${dd}`;
}

export default formatDate;
