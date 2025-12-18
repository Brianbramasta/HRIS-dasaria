import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../structure-and-organize/components/datatable/DataTable';
import { IconHapus, IconChangePassword } from '@/icons/components/icons';
import TambahRoleModal from '../../components/modals/AddRole';

interface UserData {
  no: number;
  idKaryawan: string;
  nama: string;
  role: string;
  email: string;
  password: string;
}

export default function DetailHakAksesPages() {
  const { roleId } = useParams<{ roleId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data] = useState<UserData[]>([
    { 
      no: 1, 
      idKaryawan: '1234567890', 
      nama: 'Lindsey Curtis', 
      role: 'HR Admin', 
      email: 'Maling@gmail.com', 
      password: '*******' 
    },
    { 
      no: 2, 
      idKaryawan: '1234567890', 
      nama: 'Dedik Mulyadi', 
      role: 'Super Admin', 
      email: 'Maling@gmail.com', 
      password: '*******' 
    },
    { 
      no: 3, 
      idKaryawan: '1234567890', 
      nama: 'Onana', 
      role: 'Super Admin', 
      email: 'Maling@gmail.com', 
      password: '*******' 
    },
    { 
      no: 4, 
      idKaryawan: '1234567890', 
      nama: 'Maguire', 
      role: 'Super Admin', 
      email: 'Maling@gmail.com', 
      password: '*******' 
    },
    { 
      no: 5, 
      idKaryawan: '1234567890', 
      nama: 'Mulyadi', 
      role: 'Finance Admin', 
      email: 'Maling@gmail.com', 
      password: '*******' 
    },
  ]);

  const columns: DataTableColumn<UserData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'idKaryawan', label: 'Id Karyawan', minWidth: 150 },
    { id: 'nama', label: 'Nama', minWidth: 200 },
    { id: 'role', label: 'Role', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'password', label: 'Password', minWidth: 150, sortable: false },
  ];

  const actions: DataTableAction<UserData>[] = [
    
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: (row) => {
        console.log('Delete user:', row);
        // Handle delete action
      },
    },{
      icon: <IconChangePassword color="#6C757D" />,
      onClick: (row) => {
        console.log('Change password for:', row);
        // Handle change password action
      },
    }
  ];

  // Get role name based on roleId
  const getRoleName = (id: string | undefined) => {
    const roles: Record<string, string> = {
      '225150207': 'Super Admin',
      '225150205': 'HR Admin',
      '225150206': 'Finance Admin',
    };
    return roles[id || ''] || 'Unknown Role';
  };

  const roleName = getRoleName(roleId);

  // Mock employee options untuk dropdown ID Karyawan
  const employeeOptions = [
    { value: 'EMP001', label: 'EMP001 - John Doe' },
    { value: 'EMP002', label: 'EMP002 - Jane Smith' },
    { value: 'EMP003', label: 'EMP003 - Bob Johnson' },
    { value: 'EMP004', label: 'EMP004 - Alice Williams' },
    { value: 'EMP005', label: 'EMP005 - Charlie Brown' },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    console.log('New user submitted:', values);
    // Implement API call to create new user here
    // After success, refresh the data table
  };

  return (
    <div className="p-4">
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title={roleName}
        onAdd={handleAdd}
        addButtonLabel="Tambah Pengguna"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />
      
      <TambahRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        employeeOptions={employeeOptions}
      />
    </div>
  );
}