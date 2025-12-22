import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';

interface RoleData {
  no: number;
  idRole: string;
  role: string;
}

export default function HakAksesPage() {
  const navigate = useNavigate();
  const [data] = useState<RoleData[]>([
    { no: 1, idRole: '225150207', role: 'Super Admin' },
    { no: 2, idRole: '225150205', role: 'HR Admin' },
    { no: 3, idRole: '225150206', role: 'Finance Admin' },
  ]);

  const columns: DataTableColumn<RoleData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'idRole', label: 'ID Role', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 200 },
    {
      id: 'detail',
      label: 'Detail',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (value, row) => (
        
        <button 
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" value={value}
          onClick={() => navigate(`/hak-akses/detail/${row.idRole}`)}
        >
          <IconFileDetail color="#6C757D" />
        </button>
      ),
    },
  ];

  const actions: DataTableAction<RoleData>[] = [
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: (row) => {
        navigate(`/hak-akses/edit/${row.idRole}`);
      },
    },
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: (row) => {
        console.log('Delete role:', row);
        // Handle delete action
      },
    },
  ];

  const handleAdd = () => {
    console.log('Add new role');
    // Handle add action
  };

  return (
    <div className="p-4">
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title="Akses Akun"
        onAdd={handleAdd}
        addButtonLabel="Tambah Role"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />
    </div>
  );
}