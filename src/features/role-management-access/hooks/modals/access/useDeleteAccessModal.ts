import { useMemo } from 'react';
import type { AccessData } from '../../useAccessDetail';

export const useDeleteAccessModal = (data: AccessData | null) => {
  const label = useMemo(() => {
    if (!data) return '';
    return `${data.akses} - ${data.fitur}`;
  }, [data]);

  return {
    label,
  };
};
