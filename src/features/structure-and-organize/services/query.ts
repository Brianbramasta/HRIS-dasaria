import { TableFilter } from '../types/organization.api.types';

export const buildQueryParams = (filter: TableFilter): string => {
  const params = new URLSearchParams();
  if (filter.search) params.append('q', filter.search);
  if (filter.filter) {
    const raw = filter.filter;
    const values = Array.isArray(raw)
      ? raw
      : String(raw)
          .split(',')
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 0);
    values.forEach((v: string) => params.append('filter[]', v));
  }
  if (filter.sortBy) params.append('_sort', filter.sortBy);
  if (filter.sortOrder) params.append('_order', filter.sortOrder);
  if (filter.page) params.append('_page', filter.page.toString());
  if (filter.pageSize) params.append('_limit', filter.pageSize.toString());
  return params.toString();
};
