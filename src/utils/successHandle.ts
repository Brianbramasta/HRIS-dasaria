import { addNotification } from '../stores/notificationStore';
import type { ApiResponse } from '../services/api';

/**
 * Handle success response from API
 * Shows a success notification if the response contains a success message in meta.
 * 
 * @param response - The API response object
 */
export const handleApiSuccess = (response: ApiResponse<any> | any) => {
  if (response?.meta?.message) {
    addNotification({
      title: 'Berhasil',
      description: response.meta.message,
      variant: 'success',
    });
  }
};
