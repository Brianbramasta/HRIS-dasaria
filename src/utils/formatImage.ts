export function formatImage(value: string | null, name: string): string {
  return value || name.charAt(0) || '—';
}