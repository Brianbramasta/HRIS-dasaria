import useTemporaryApiStore from "@/stores/useTemporaryApiStore";

export function formatUrlFile(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  const tempApiUrl = useTemporaryApiStore.getState().apiUrl;
  const baseUrl = (globalThis as any).API_URL ?? '';
  if (tempApiUrl) {
    return `${tempApiUrl}/storage/${url}`;
  }
  return `${baseUrl}/storage/${url}`;
}
