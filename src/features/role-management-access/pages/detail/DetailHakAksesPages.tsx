import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconHapus, IconChangePassword, IconEmail } from '@/icons/components/icons';
import TambahRoleModal from '../../components/modals/detail-role/AddRoleModal';
import SendEmailModal from '../../components/modals/SendEmailModal';
import ResetPasswordModal from '../../components/modals/detail-role/ResetPasswordModal';
import DeleteRoleModal from '../../components/modals/detail-role/DeleteRoleModal';

interface UserData {
  no: number;
  idKaryawan: string;
  nama: string;
  posisi: string;
  direktorat: string;
  email: string;
}

export default function DetailHakAksesPages() {
  const { roleId } = useParams<{ roleId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [data] = useState<UserData[]>([
    {
      no: 1,
      idKaryawan: 'DSR999',
      nama: 'Lindsey Curtis',
      posisi: 'Direktur HRGA',
      direktorat: 'HRGA',
      email: 'Maling@gmail.com',
    },
    {
      no: 2,
      idKaryawan: 'DSR999',
      nama: 'Dedik Mulyadi',
      posisi: 'Direktur N&T',
      direktorat: 'Direktur N&T',
      email: 'Maling@gmail.com',
    },
    {
      no: 3,
      idKaryawan: 'DSR999',
      nama: 'Onana',
      posisi: 'Direktur FAT',
      direktorat: 'FAT',
      email: 'Maling@gmail.com',
    },
    {
      no: 4,
      idKaryawan: 'DSR999',
      nama: 'Maguire',
      posisi: 'Direktur Utama',
      direktorat: '-',
      email: 'Maling@gmail.com',
    },
    {
      no: 5,
      idKaryawan: 'DSR999',
      nama: 'Mulyadi',
      posisi: 'Direktur BusDev',
      direktorat: 'Finance Admin',
      email: 'Maling@gmail.com',
    },
  ]);

  const columns: DataTableColumn<UserData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'idKaryawan', label: 'NIP', minWidth: 150 },
    { id: 'nama', label: 'Nama', minWidth: 200 },
    { id: 'posisi', label: 'Posisi', minWidth: 150 },
    { id: 'direktorat', label: 'Direktorat', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
  ];

  const actions: DataTableAction<UserData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: (row) => {
        setSelectedUser(row);
        setIsDeleteModalOpen(true);
      },
    },
    {
      icon: <IconChangePassword color="#6C757D" />,
      onClick: (row) => {
        setSelectedUser(row);
        setIsResetPasswordModalOpen(true);
      },
    },
    {
      icon: <IconEmail color="#6C757D" />,
      onClick: (row) => {
        setSelectedUser(row);
        setIsSendEmailModalOpen(true);
      },
    },
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

  // Mock employee options untuk dropdown NIP
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

      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        onSubmit={() => {
          console.log('Email sent to:', selectedUser);
          setIsSendEmailModalOpen(false);
        }}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSubmit={(values) => {
          console.log('Reset password submitted:', values);
          setIsResetPasswordModalOpen(false);
        }}
        data={selectedUser ? { nip: selectedUser.idKaryawan, nama: selectedUser.nama } : null}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          console.log('Delete user confirmed:', selectedUser);
          setIsDeleteModalOpen(false);
        }}
        roleName={roleName}
      />
    </div>
  );
}