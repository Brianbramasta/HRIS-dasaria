import React from 'react';


interface HeaderModalDeleteProps {
  icon: string;
  title: string;
}

const HeaderModalDelete: React.FC<HeaderModalDeleteProps> = ({ icon='⚠️', title='Hapus Data' }) => {
  

  return (
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">{icon}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
  );
};

export default HeaderModalDelete;