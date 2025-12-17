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

/**
 * Convert date from yyyy-mm-dd format to Indonesian date format (DD Month YYYY)
 * @param value - Date string in yyyy-mm-dd format
 * @returns Date string in Indonesian format (e.g., "14 Juni 2003") or empty string if invalid
 */
export function formatDateToIndonesian(value: string): string {
  if (!value || typeof value !== "string") return "";
  
  // Match yyyy-mm-dd pattern
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  
  const [, yyyy, mm, dd] = match;
  
  // Validate date components
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  
  // Indonesian month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  // Return in Indonesian format: DD Month YYYY
  return `${day} ${monthNames[month - 1]} ${yyyy}`;
}

/**
 * Convert date from Indonesian format (DD Month YYYY) to yyyy-mm-dd format
 * @param value - Date string in Indonesian format (e.g., "14 Juni 2003")
 * @returns Date string in yyyy-mm-dd format or empty string if invalid
 */
export function formatIndonesianToISO(value: string): string {
  if (!value || typeof value !== "string") return "";
  
  // Indonesian month names mapping
  const monthMap: { [key: string]: string } = {
    "Januari": "01",
    "Februari": "02",
    "Maret": "03",
    "April": "04",
    "Mei": "05",
    "Juni": "06",
    "Juli": "07",
    "Agustus": "08",
    "September": "09",
    "Oktober": "10",
    "November": "11",
    "Desember": "12"
  };
  
  // Match pattern: DD Month YYYY (e.g., "14 Juni 2003")
  const match = value.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (!match) return "";
  
  const [, day, monthName, year] = match;
  
  // Get month number from month name
  const month = monthMap[monthName];
  if (!month) return "";
  
  // Validate day
  const dayNum = parseInt(day, 10);
  if (dayNum < 1 || dayNum > 31) return "";
  
  // Pad day with leading zero if needed
  const paddedDay = day.padStart(2, "0");
  
  // Return in yyyy-mm-dd format
  return `${year}-${month}-${paddedDay}`;
}

export default formatDate;
