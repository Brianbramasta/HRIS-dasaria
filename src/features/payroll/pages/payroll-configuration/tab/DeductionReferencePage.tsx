import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil } from '@/icons/components/icons';
import EditAcuanPotonganModal from '@/features/payroll/components/modals/payroll-configuration/deduction-reference/EditDeductionReferenceModal';
import { useRefDeduction, RefDeductionRow } from '@/features/payroll/hooks/payroll-configuration/deduction-reference/useRefDeduction';

export default function AcuanPotonganPage() {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    
    // Modal & Handlers
    editModal,
    selected,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useRefDeduction();

  const columns: DataTableColumn<RefDeductionRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'acuanPotongan', label: 'Acuan Potongan', sortable: true },
    { id: 'kategori', label: 'Kategori', sortable: true },
    { id: 'nominal', label: 'Nominal', align: 'right', sortable: true },
    { id: 'keterangan', label: 'Keterangan', sortable: false },
  ];

  const actions: DataTableAction<RefDeductionRow>[] = [
    { 
      label: '', 
      icon: <IconPencil />, 
      onClick: (row) => handleEditOpen(row.raw), 
      variant: 'outline', 
      className: 'border-0' 
    },
  ];

  // Dokumentasi: util sederhana untuk ekspor
  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => k !== 'raw' && k !== 'id');
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <DataTable
        title="Acuan Potongan"
        resetKey='Acuan Potongan'
        data={rows}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        searchable
        filterable
        onSearchChange={(val) => { setSearch(val); }}
        onSortChange={(columnId, order) => { setSort(columnId, order); }}
        onPageChangeExternal={(p) => { setPage(p); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
        onExport={() => exportCSV('acuan-potongan.csv', rows)}
      />
      <EditAcuanPotonganModal
        isOpen={editModal.isOpen}
        onClose={handleClose}
        refDeductionData={selected}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
