// import { addNotification } from '../stores/notificationStore';

export type HandleApiErrorOptions = {
  title?: string;
  hideDuration?: number;
};

/**
 * Extract messages from common API error shapes and show a notification.
 * Returns an array of extracted messages for further handling if needed.
 */
export const handleApiError = (err: unknown /*, opts?: HandleApiErrorOptions*/): string[] => {
  // const title = opts?.title ?? 'Error';
  // const duration = opts?.hideDuration ?? 7000;

  const messages: string[] = [];

  if (!err) {
    messages.push('Unknown error');
  } else if (typeof err === 'string') {
    messages.push(err);
  } else if (typeof err === 'object') {
    const anyErr = err as any;

    // Axios-style response with data.meta.message and/or data.errors
    if (anyErr.response?.data) {
      const data = anyErr.response.data;
      if (data?.meta?.message) messages.push(String(data.meta.message));

      if (data?.errors && typeof data.errors === 'object') {
        for (const key of Object.keys(data.errors)) {
          const v = data.errors[key];
          if (Array.isArray(v)) messages.push(...v.map(String));
          else if (typeof v === 'string') messages.push(v);
        }
      }
    }

    // Handle ApiError structure directly (rejected from interceptor)
    if (anyErr.meta?.message) {
      messages.push(String(anyErr.meta.message));
    }

    if (anyErr.errors && typeof anyErr.errors === 'object') {
      for (const key of Object.keys(anyErr.errors)) {
        const v = anyErr.errors[key];
        if (Array.isArray(v)) messages.push(...v.map(String));
        else if (typeof v === 'string') messages.push(v);
      }
    }

    // Some APIs return { message: '...' }
    if (anyErr.message && typeof anyErr.message === 'string') messages.push(anyErr.message);

    // Raw response body fallback
    if (anyErr.data && typeof anyErr.data === 'string') messages.push(anyErr.data);
  }

  if (messages.length === 0) messages.push('Terjadi kesalahan. Silakan coba lagi.');

  // Build description (join limited messages)
  const description = messages.slice(0, 6).join('\n');
  alert(description);

  // Show notification
  // addNotification({
  //   variant: 'error',
  //   title,
  //   description,
  //   hideDuration: duration,
  // });

  return messages;
};

export default handleApiError;
