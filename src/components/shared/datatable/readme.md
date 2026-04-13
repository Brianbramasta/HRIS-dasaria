# Dokumentasi Komponen DataTable

## Gambaran Umum

`DataTable` adalah komponen tabel data yang komprehensif dan sangat konfigurabel untuk aplikasi React. Komponen ini menyediakan fitur-fitur ekstensif untuk menampilkan, memanipulasi, dan berinteraksi dengan data dengan dukungan untuk operasi client-side dan server-side.

## Fitur

### Fitur Inti
- **Render Data Dinamis** - Menampilkan data dengan kolom yang dapat dikonfigurasi
- **Pagination** - Navigasi data dengan opsi rows per page yang dapat disesuaikan
- **Sorting** - Mengurutkan data per kolom (ascending/descending)
- **Searching** - Mencari data dengan filter kata kunci
- **Loading State** - Menampilkan indikator loading saat pengambilan data
- **Empty State** - Menampilkan pesan ketika tidak ada data

### Filtering Lanjutan
- **Global Filter** - Modal filter untuk visibilitas kolom dan item filter
- **Column Filter** - Filter dropdown per kolom dengan opsi kustom
- **Date Range Filter** - Pemilih rentang tanggal untuk kolom tanggal
- **Filter Persistence** - Mempertahankan state filter (client-side atau server-side)

### Kustomisasi Toolbar
- **Custom Toolbar Slots** - Menambahkan komponen kustom ke toolbar
- **Layout Toolbar Atas** - Layout kiri-kanan untuk tombol aksi
- **Default Actions** - Tombol Export dan Tambah bawaan dengan fallback behavior

### Konfigurasi Kolom
- **Custom Cell Formatting** - Render konten kustom di sel
- **Custom Header Formatting** - Konten header kustom (checkbox, dll)
- **Text Alignment** - Konfigurasi align kolom (left/center/right)
- **Column Visibility** - Show/hide kolom secara dinamis
- **Action Columns** - Tombol aksi primer dan sekunder

### Fungsi Export
- **Export Modal** - Memilih kolom untuk diekspor
- **Export Preview** - Pratinjau data sebelum ekspor
- **Custom Export Handler** - Callback untuk implementasi logika export

### Opsi Pagination
- **Client-side Pagination** - Pagination berbasis browser
- **Server-side Pagination** - Pagination yang digerakkan API
- **Disable Pagination** - Opsi untuk mematikan pagination
- **Custom Page Sizes** - Opsi rows per page yang dapat dikonfigurasi

### Fitur UI/UX
- **Responsive Design** - Layout adaptif untuk mobile dan desktop
- **Dark Mode Support** - Kompatibilitas tema gelap bawaan
- **Custom Styling** - Props untuk className, border, maxHeight
- **Sticky Header** - Header tetap saat scrolling
- **Hover Effects** - Feedback interaksi visual

### Manajemen State
- **Internal State** - State yang dikelola otomatis untuk operasi client-side
- **External Control** - Callback untuk sinkronisasi dengan komponen parent
- **Reset Capability** - Reset filter menggunakan resetKey
- **Conditional Actions** - Show/hide aksi berdasarkan kondisi data

## Props API

### DataTableColumn Interface

```typescript
export interface DataTableColumn<T = any> {
  id: string;                              // Column identifier
  label: string;                           // Column header text
  minWidth?: number;                       // Minimum column width
  align?: 'left' | 'center' | 'right';    // Text alignment
  format?: (value: any, row: T) => React.ReactNode;  // Custom cell renderer
  headerFormat?: () => React.ReactNode;    // Custom header renderer
  sortable?: boolean;                      // Enable sorting (default: true)
  filterable?: boolean;                    // Enable filtering
  isAction?: boolean;                      // Mark as action column
  filterOptions?: ColumnFilterOption[];    // Dropdown filter options
  dateRangeFilter?: boolean;               // Enable date range filter
  filterMaxRows?: number;                  // Max rows for filter dropdown
}
```

### DataTableAction Interface

```typescript
export interface DataTableAction<T = any> {
  label?: string;                          // Button text
  icon?: React.ReactNode;                  // Button icon
  onClick: (row: T) => void;               // Click handler
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'text' | 'outline' | 'primary' | 'custom';
  condition?: (row: T) => boolean;        // Show/hide condition
  className?: string;                      // Custom CSS classes
}
```

### DataTableProps Interface

```typescript
interface DataTableProps<T = any> {
  // Data & Columns
  data: T[];                               // Table data
  columns: DataTableColumn<T>[];          // Column definitions
  actions?: DataTableAction<T>[];          // Primary actions
  secondaryActions?: DataTableAction<T>[];  // Secondary actions
  
  // Display
  title?: string;                          // Table title
  searchable?: boolean;                    // Enable search
  searchPlaceholder?: string;              // Search input placeholder
  pageSize?: number;                       // Default page size
  pageSizeOptions?: number[];              // Page size options
  emptyMessage?: string;                   // Empty state message
  loading?: boolean;                       // Loading state
  className?: string;                      // Custom CSS classes
  border?: boolean;                        // Show border
  maxHeight?: string;                       // Max height for table container
  disablePagination?: boolean;             // Disable pagination
  clientSide?: boolean;                    // Force client-side mode
  
  // Actions
  onAdd?: () => void;                      // Add button handler
  addButtonLabel?: string;                 // Add button text
  addButtonIcon?: React.ReactNode;         // Add button icon
  onExport?: () => void;                   // Export button handler
  exportButtonLabel?: string;              // Export button text
  filterable?: boolean;                    // Enable filter button
  
  // Callbacks
  onSearchChange?: (search: string) => void;
  onSortChange?: (columnId: string, order: 'asc' | 'desc') => void;
  onPageChangeExternal?: (page: number) => void;
  onRowsPerPageChangeExternal?: (rowsPerPage: number) => void;
  onColumnVisibilityChange?: (visibleColumnIds: string[]) => void;
  onFilter?: (filter: string) => void;
  onColumnFilterChange?: (columnId: string, values: string[]) => void;
  onDateRangeFilterChange?: (columnId: string, startDate: string, endDate: string | null) => void;
  
  // External State
  useExternalPagination?: boolean;         // Server-side pagination
  externalPage?: number;                   // Current page (server-side)
  externalTotal?: number;                  // Total records (server-side)
  columnFilters?: Record<string, string[]>; // External column filters
  dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>; // External date filters
  
  // Toolbar Customization
  toolbarRightSlot?: React.ReactNode;       // Right toolbar slot
  toolbarRightSlotAtas?: React.ReactNode;   // Upper right toolbar slot
  toolbarLeftSlotAtas?: React.ReactNode;    // Upper left toolbar slot
  appendDefaultToolbarRightAtas?: boolean;  // Show default buttons with custom slots
  
  // Other
  resetKey?: string;                       // Key to reset internal state
  isNewLine?: boolean;                      // Show title on new line
}

## Contoh Penggunaan

### Penggunaan Dasar

```typescript
import { DataTable } from '@/components/shared/datatable/DataTable';

const columns = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
];

const actions = [
  {
    label: 'Edit',
    icon: <EditIcon />,
    onClick: (row) => handleEdit(row),
    variant: 'outline' as const,
  },
  {
    label: 'Delete',
    icon: <DeleteIcon />,
    onClick: (row) => handleDelete(row),
    color: 'error' as const,
  },
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  title="User List"
  onAdd={() => setShowAddModal(true)}
  onExport={() => handleExport()}
/>
```

### Penggunaan Lanjutan dengan Filter

```typescript
const columns = [
  { 
    id: 'name', 
    label: 'Name', 
    sortable: true,
    filterOptions: [
      { value: 'john', label: 'John' },
      { value: 'jane', label: 'Jane' },
    ]
  },
  { 
    id: 'joinDate', 
    label: 'Join Date', 
    sortable: true,
    dateRangeFilter: true,
    format: (value) => new Date(value).toLocaleDateString()
  },
  { 
    id: 'status', 
    label: 'Status',
    format: (value) => (
      <Badge color={value === 'active' ? 'success' : 'warning'}>
        {value}
      </Badge>
    )
  },
];

<DataTable
  data={employees}
  columns={columns}
  onColumnFilterChange={handleColumnFilter}
  onDateRangeFilterChange={handleDateRangeFilter}
  columnFilters={columnFilters}
  dateRangeFilters={dateRangeFilters}
  useExternalPagination={true}
  externalPage={currentPage}
  externalTotal={totalRecords}
  onPageChangeExternal={handlePageChange}
  onRowsPerPageChangeExternal={handleRowsPerPageChange}
/>
```

### Toolbar Kustom

```typescript
<DataTable
  data={data}
  columns={columns}
  toolbarLeftSlotAtas={
    <Select
      options={departmentOptions}
      value={selectedDepartment}
      onChange={handleDepartmentChange}
      placeholder="Select Department"
    />
  }
  toolbarRightSlotAtas={
    <div className="flex gap-2">
      <Button onClick={handleImport}>Import</Button>
      <Button onClick={handleDownloadTemplate}>Download Template</Button>
    </div>
  }
  appendDefaultToolbarRightAtas={true}
  onAdd={handleAdd}
  onExport={handleExport}
/>
```

## Custom Hooks

Komponen ini menggunakan beberapa custom hooks untuk logika bisnis:

- `useDatatable` - Logika inti tabel (sorting, pagination, filtering)
- `useFilterModal` - Manajemen state modal filter
- `useExportModal` - Manajemen state modal export
- `useFilterModal` - Logika filtering kolom

## Styling

Komponen ini menggunakan kelas Tailwind CSS dan mendukung:

- Dark mode melalui prefix `dark:`
- Styling kustom melalui prop `className`
- Responsive design dengan breakpoint `md:`
- Hover states dan transisi

## Pertimbangan Performa

- Gunakan `clientSide={true}` untuk dataset kecil (< 1000 records)
- Gunakan server-side pagination untuk dataset besar
- Implementasikan memoization yang tepat untuk custom formatters
- Debounce search callbacks untuk UX yang lebih baik

## Aksesibilitas

- Struktur tabel HTML semantik
- Dukungan navigasi keyboard
- Label ARIA yang sesuai
- Manajemen fokus di modal

## Dependensi

- React (hooks, manajemen state)
- Komponen UI kustom (Button, Table, dll)
- Library ikon (react-feather, ikon kustom)
- Custom hooks untuk logika bisnis