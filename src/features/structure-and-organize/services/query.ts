import { TableFilter } from '../types/organization.api.types';

export const buildQueryParams = (filter: TableFilter): string => {
  const params = new URLSearchParams();
  if (filter.search) params.append('q', filter.search);
  if (filter.filter) {
    const raw = filter.filter;
    if (raw.includes(',')) {
      raw.split(',').map((v) => v.trim()).filter((v) => v.length > 0).forEach((v) => {
        params.append('filter[]', v);
      });
    } else {
      params.append('filter', raw);
    }
  }
  if (filter.sortBy) params.append('_sort', filter.sortBy);
  if (filter.sortOrder) params.append('_order', filter.sortOrder);
  if (filter.page) params.append('_page', filter.page.toString());
  if (filter.pageSize) params.append('_limit', filter.pageSize.toString());
  return params.toString();
};