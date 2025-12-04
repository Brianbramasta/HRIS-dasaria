export function formatUrlFile(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  return `http://192.168.1.9:8000/storage/${url}`;
}
