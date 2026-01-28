import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';
import useFeatureDetail, { FeatureData } from '../hooks/useFeatureDetail';
// TODO: Create and import these modals
// import AddFeatureModal from '../components/modals/feature/AddFeatureModal';
// import EditFeatureModal from '../components/modals/feature/EditFeatureModal';
// import DeleteFeatureModal from '../components/modals/feature/DeleteFeatureModal';

export default function FeatureDetail() {
  const {
    featureData,
    handleAddFeature,
    handleEditFeature,
    handleDeleteFeature,
    handleDetailFeature,
    isAddFeatureModalOpen,
    setIsAddFeatureModalOpen,
    isEditFeatureModalOpen,
    setIsEditFeatureModalOpen,
    isDeleteFeatureModalOpen,
    setIsDeleteFeatureModalOpen,
    selectedFeature,
    onDeleteConfirm,
  } = useFeatureDetail();

  // Columns for Feature
  const featureColumns: DataTableColumn<FeatureData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'fitur', label: 'Fitur', minWidth: 200 },
    { id: 'modul', label: 'Modul', minWidth: 200 },
    {
      id: 'detail',
      label: 'Detail',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (_value, row) => (
        <button 
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleDetailFeature(row)}
        >
          <IconFileDetail color="#6C757D" />
        </button>
      ),
    },
  ];

  const featureActions: DataTableAction<FeatureData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: handleDeleteFeature,
    },
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: handleEditFeature,
    },
  ];

  return (
    <div className="px-4 space-y-8 pb-8">
      <DataTable
        data={featureData}
        columns={featureColumns}
        actions={featureActions}
        title="Detail Fitur"
        onAdd={handleAddFeature}
        addButtonLabel="Tambah Fitur"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />
      {/* 
      <AddFeatureModal
        isOpen={isAddFeatureModalOpen}
        onClose={() => setIsAddFeatureModalOpen(false)}
      />
      <EditFeatureModal
        isOpen={isEditFeatureModalOpen}
        onClose={() => setIsEditFeatureModalOpen(false)}
        data={selectedFeature}
      />
      <DeleteFeatureModal
        isOpen={isDeleteFeatureModalOpen}
        onClose={() => setIsDeleteFeatureModalOpen(false)}
        onDelete={onDeleteConfirm}
        featureName={selectedFeature?.fitur}
      /> 
      */}
    </div>
  );
}
