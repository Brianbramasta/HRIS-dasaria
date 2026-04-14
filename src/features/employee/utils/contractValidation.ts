/**
 * Validation utilities for contract dates
 * Based on brief documentation requirements
 */

export interface ValidationError {
  field: 'start_date' | 'end_date';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates contract start date and end date based on business rules
 */
export function validateContractDates(
  startDate: string,
  endDate: string,
  employeeJoinDate: string,
  today: Date = new Date()
): ValidationResult {
  const errors: ValidationError[] = [];

  // Helper function to format date for comparison
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date(0); // Invalid date for empty strings
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const join = parseDate(employeeJoinDate);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Validasi A - Tanggal Mulai Kontrak
  if (startDate) {
    // Tanggal Mulai Kontrak harus lebih dari atau sama dengan Tanggal Masuk karyawan
    if (start < join) {
      errors.push({
        field: 'start_date',
        message: `Tanggal mulai kontrak tidak boleh sebelum tanggal masuk karyawan (${formatDateToIndonesian(employeeJoinDate)}).`
      });
    }

    // Tanggal Mulai Kontrak harus lebih dari atau sama dengan hari ini
    if (start < todayDate) {
      errors.push({
        field: 'start_date',
        message: 'Tanggal mulai kontrak tidak boleh sebelum hari ini.'
      });
    }
  }

  // Validasi B - Tanggal Berakhir Kontrak
  if (endDate) {
    // Tanggal Berakhir Kontrak harus lebih besar dari Tanggal Mulai Kontrak
    if (startDate && end <= start) {
      errors.push({
        field: 'end_date',
        message: end.getTime() === start.getTime() 
          ? 'Tanggal berakhir kontrak harus lebih dari tanggal mulai kontrak.'
          : 'Tanggal berakhir kontrak tidak boleh sebelum tanggal mulai kontrak.'
      });
    }

    // Tanggal Berakhir Kontrak harus lebih besar dari hari ini
    if (end <= todayDate) {
      errors.push({
        field: 'end_date',
        message: end.getTime() === todayDate.getTime()
          ? 'Tanggal berakhir kontrak harus lebih dari hari ini.'
          : 'Tanggal berakhir kontrak tidak boleh di masa lalu. Masukkan tanggal yang akan datang.'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get error message for a specific field
 */
export function getErrorMessage(
  validationResult: ValidationResult,
  field: 'start_date' | 'end_date'
): string | null {
  const error = validationResult.errors.find(err => err.field === field);
  return error ? error.message : null;
}

/**
 * Helper function to format date to Indonesian format (DD/MM/YYYY)
 */
function formatDateToIndonesian(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Check if a date string is valid (YYYY-MM-DD format)
 */
export function isValidDateFormat(dateString: string): boolean {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
