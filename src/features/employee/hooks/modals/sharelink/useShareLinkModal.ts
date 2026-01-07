import { useCallback } from 'react';

export const useShareLinkModal = (link: string, message?: string) => {
  const msg = message ?? 'Silakan isi data karyawan melalui tautan berikut';

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Tautan disalin');
    } catch (e) {
      window.prompt('Salin tautan secara manual:', e as string);
    }
  }, [link]);

  const openWhatsApp = useCallback(() => {
    const text = `${msg} ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }, [msg, link]);

  const openEmail = useCallback(() => {
    const subject = 'Bagikan Tautan';
    const body = `${msg}\n${link}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }, [msg, link]);

  const openTelegram = useCallback(() => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }, [link, msg]);

  return {
    copyLink,
    openWhatsApp,
    openEmail,
    openTelegram,
  };
};

export default useShareLinkModal;
