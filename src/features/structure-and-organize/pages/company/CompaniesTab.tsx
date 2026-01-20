import { Link } from 'react-router';
import DataTable, { DataTableColumn } from '../../../../components/shared/datatable/DataTable';
import { useCompanies } from '../../Index';
import type { CompanyRow } from '../../types/OrganizationTableTypes';
import AddCompanyModal from '../../components/modals/company/AddCompanyModal';
import EditCompanyModal from '../../components/modals/company/EditCompanyModal';
import DeleteCompanyModal from '../../components/modals/company/DeleteCompanyModal';
import { FileText } from '@/icons/components/icons';

type Props = { resetKey: string };

const companyColumns: DataTableColumn<CompanyRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'lini-bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: false, align: 'center', isAction: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/companies/${(row as any).id ?? (row as any).no}`} className="flex justify-center items-center text-brand-600 hover:underline">
      <FileText size={16} />
    </Link>
  ) },
];

export default function CompaniesTab({ resetKey }: Props) {
  const { 
    // Data
    rows,
    actionsIconOnly,
    loading,
    
    // Pagination & Filter
    pageSize,
    page,
    total,
    setSearch,
    setSort,
    setPage,
    setPageSize,
    
    // Modal State & Handlers
    isAddOpen,
    setAddOpen,
    handleCloseAdd,
    handleSuccessAdd,
    
    isEditOpen,
    handleCloseEdit,
    selectedCompany,
    handleSuccessEdit,
    
    isDeleteOpen,
    handleCloseDelete,
    handleSuccessDelete
  } = useCompanies();

  return (
    <div>
    <DataTable
      title="Perusahaan"
      data={rows}
      columns={companyColumns}
      actions={actionsIconOnly}
      loading={loading}
      pageSize={pageSize}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); }}
      onPageChangeExternal={(p) => { setPage(p); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
      
      onAdd={() => setAddOpen(true)}
      onExport={() => true}
    />
    <AddCompanyModal
      isOpen={isAddOpen}
      onClose={handleCloseAdd} 
      onSuccess={handleSuccessAdd}
    />
    <EditCompanyModal
      isOpen={isEditOpen}
      onClose={handleCloseEdit}
      company={selectedCompany}
      onSuccess={handleSuccessEdit}
    />
    <DeleteCompanyModal
      isOpen={isDeleteOpen}
      onClose={handleCloseDelete}
      company={selectedCompany || undefined}
      onSuccess={handleSuccessDelete}
    />
    </div>
  );
}
