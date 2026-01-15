import { useMemo, useState } from 'react';

export type UnitItem = {
  id: string;
  name: string;
  department: string;
  description: string;
  hasFile: boolean;
};

export type UnitRow = {
  id: string;
  no: number;
  'nama-unit': string;
  departemen: string;
  'deskripsi-umum': string;
  'file-sk-dan-memin': string;
};

export const useUnits = () => {
  const [units] = useState<UnitItem[]>([
    {
      id: '1',
      name: 'Branch Ambarawa',
      department: 'Regional 1',
      description: 'Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec.',
      hasFile: true,
    },
    {
      id: '2',
      name: 'Branch Pasuruan',
      department: 'Regional 2',
      description: 'Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec.',
      hasFile: true,
    },
    {
      id: '3',
      name: 'Branch Temas',
      department: 'Regional 1',
      description: 'Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec.',
      hasFile: true,
    },
    {
      id: '4',
      name: 'Branch Pakis',
      department: 'Regional 3',
      description: 'Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec.',
      hasFile: true,
    },
    {
      id: '5',
      name: 'Branch BumiAji',
      department: 'Regional 2',
      description: 'Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec.',
      hasFile: true,
    },
  ]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const filteredUnits = useMemo(() => {
    if (!search) return units;
    const term = search.toLowerCase();
    return units.filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term) ||
        u.description.toLowerCase().includes(term),
    );
  }, [units, search]);

  const total = filteredUnits.length;

  const rows_column: UnitRow[] = useMemo(
    () =>
      filteredUnits.map((u, idx) => ({
        id: u.id,
        no: idx + 1 + (page - 1) * pageSize,
        'nama-unit': u.name,
        departemen: u.department,
        'deskripsi-umum': u.description,
        'file-sk-dan-memin': u.hasFile ? 'Ada' : '—',
      })),
    [filteredUnits, page, pageSize],
  );

  return {
    units,
    rows_column,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    setSearch,
  };
};

