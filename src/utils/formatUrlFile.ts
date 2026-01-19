export function formatUrlFile(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  const baseUrl = (globalThis as any).VITE_API_URL ?? '';
  return `${baseUrl}/storage/${url}`;
}
