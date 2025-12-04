export function formatUrlFile(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  return `${import.meta.env.VITE_SHARING_URL}/storage/${url}`;
}
