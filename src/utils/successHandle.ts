import { addNotification } from '../stores/notificationStore';
import type { ApiResponse } from '../services/api';

/**
 * Handle success response from API
 * Shows a success notification if response contains a success message in meta.
 * 
 * @param response - The API response object
 * @param showNotification - Whether to show notification or not (default: true)
 */
export const handleApiSuccess = (response: ApiResponse<any> | any, showNotification: boolean = true) => {
  if (showNotification && response?.meta?.message) {
    addNotification({
      title: 'Berhasil',
      description: response.meta.message,
      variant: 'success',
    });
  }
};
