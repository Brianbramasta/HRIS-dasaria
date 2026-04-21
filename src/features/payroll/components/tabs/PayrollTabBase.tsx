import { useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import DeleteDataGajiModal from '@/features/payroll/components/modals/DeletePayrollDataModal';
import UploadExcelModal from '@/features/payroll/components/modals/UploadExcelModal';
import PayrollApprovalModal from '@/features/payroll/components/modals/payroll-period-approval/PayrollApprovalModal';
import usePayrollTabBase, { BaseRow } from '@/features/payroll/hooks/tabs/usePayrollTabBase';
import { useApiPayrollPeriod } from '@/features/payroll/hooks/api/useApiPayrollPeriod';
import { useTemporaryApiStore } from '@/stores/useTemporaryApiStore';
import { usePayrollApprovalStore } from '@/features/payroll/store/usePayrollApprovalStore';

type Props<TRow extends BaseRow> = {
  resetKey: string;
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  title?: string;
  onDetailNavigation?: (id: string) => void;
  toolbarRightSlot?: React.ReactNode;
  customActions?: DataTableAction<TRow>[];
  onFinalize?: (rows: TRow[]) => Promise<boolean>;
  approvalType?: string; // Added for approval page type

  enableSelection?: boolean;
  disableSelection?: boolean;
  isRowSelectable?: (row: TRow) => boolean;
  disableImportButton?: boolean;
  disableFinalizeButton?: boolean;
  disableTemplateButton?: boolean;
  templateType?: 'Mitra' | 'Staff' | 'Thr';

  loading?: boolean;
  pageSize?: number;
  useExternalPagination?: boolean;
  externalPage?: number;
  externalTotal?: number;
  onSearchChange?: (search: string) => void;
  onSortChange?: (columnId: string, order: 'asc' | 'desc') => void;
  onPageChangeExternal?: (page: number) => void;
  onRowsPerPageChangeExternal?: (rowsPerPage: number) => void;
  onColumnFilterChange?: (columnId: string, values: string[]) => void;
  columnFilters?: Record<string, string[]>;
  onDateRangeFilterChange?: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;

  canEditDelete?: (row: TRow) => boolean;
};

export default function PenggajianTabBase<TRow extends BaseRow>({
  resetKey,
  rows,
  baseColumns,
  detailPathPrefix,
  title = 'Periode Gajian',
  onDetailNavigation,
  toolbarRightSlot,
  customActions,
  onFinalize,
  approvalType,

  enableSelection = true,
  disableSelection = false,
  isRowSelectable,
  disableImportButton = false,
  disableFinalizeButton = false,
  disableTemplateButton = false,
  templateType,

  loading,
  pageSize,
  useExternalPagination,
  externalPage,
  externalTotal,
  onSearchChange,
  onSortChange,
  onPageChangeExternal,
  onRowsPerPageChangeExternal,
  onColumnFilterChange,
  columnFilters,
  onDateRangeFilterChange,
  dateRangeFilters,

  canEditDelete,
}: Props<TRow>) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deletePayrollPeriod, processUpload } = useApiPayrollPeriod();
  const { apiUrl } = useTemporaryApiStore();
  const approvalStore = usePayrollApprovalStore();

  const {
    isApprovalPage,
    isDistribusiPage,
    hasSelection,
    selectedRows,
    clearSelection,
    showDelete,
    setShowDelete,
    rowToDelete,
    setRowToDelete,
    showUpload,
    setShowUpload,
    columns,
    actions,
  } = usePayrollTabBase({
    rows,
    baseColumns,
    detailPathPrefix,
    onDetailNavigation,
    customActions,
    canEditDelete,
    enableSelection,
    disableSelection,
    isRowSelectable,
  });

  const handleApprovalConfirm = async () => {
    setIsApproving(true);
    try {
      if (!onFinalize) return;
      const ok = await onFinalize(selectedRows as TRow[]);
      if (ok) clearSelection();
    } finally {
      setIsApproving(false);
      setShowApprovalModal(false);
    }
  };

  // const approvalDescription = isDistribusiPage
  //   ? 'Slip gaji akan didistribusikan kepada karyawan yang dipilih. Pastikan data penerima dan nominal sudah sesuai sebelum melanjutkan.'
  //   : 'Periode gaji yang disahkan akan dikunci dan tidak dapat diubah. Pastikan semua data telah sesuai sebelum melanjutkan proses approval.';

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    const baseRow = rowToDelete as BaseRow;
    const payrollId = baseRow.payrollId ?? baseRow.idKaryawan;
    if (!payrollId) return;

    setIsDeleting(true);
    try {
      const ok = await deletePayrollPeriod({ payrollId: String(payrollId) });
      if (!ok) return;

      setShowDelete(false);
      setRowToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const toolbarRightSlotAtas = isApprovalPage
    ? (<>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* <Button variant="custom" className="bg-[red] text-white dark:text-white" size="sm" disabled={!hasSelection}>Ditolak</Button> */}
          <Button
            variant="custom"
            className="bg-success text-white dark:text-white w-full sm:w-auto"
            size="sm"
            disabled={!hasSelection || !onFinalize || (approvalType ? approvalStore.isApprovalDisabled(approvalType) : false)}
            onClick={() => setShowApprovalModal(true)}
          >
            Setuju
          </Button>
        </div>
        </>
      )
    : isDistribusiPage
    ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="custom"
            className='w-full sm:w-auto bg-[#007BFF] text-white dark:text-white'
            size="sm"
            disabled={!hasSelection || !onFinalize || approvalStore.isDistributionDisabled()}
            onClick={() => setShowApprovalModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.4166 11.0416H4.58343C4.26577 11.0419 3.96122 11.1682 3.7366 11.3929C3.51199 11.6175 3.38565 11.922 3.38531 12.2397V18.1772C3.38571 18.4948 3.51208 18.7993 3.7367 19.0238C3.96131 19.2484 4.26582 19.3747 4.58343 19.375H15.4166C15.7342 19.3747 16.0387 19.2484 16.2633 19.0238C16.4879 18.7993 16.6143 18.4948 16.6147 18.1772V12.2397C16.6143 11.922 16.488 11.6175 16.2634 11.3929C16.0388 11.1682 15.7342 11.0419 15.4166 11.0416ZM15.9897 18.1772C15.9895 18.3291 15.929 18.4747 15.8216 18.5821C15.7141 18.6895 15.5685 18.7499 15.4166 18.75H4.58343C4.43152 18.7499 4.28585 18.6895 4.1784 18.5821C4.07095 18.4747 4.0105 18.3291 4.01031 18.1772V12.2397C4.01043 12.0877 4.07085 11.942 4.17831 11.8346C4.28576 11.7271 4.43147 11.6667 4.58343 11.6666H15.4166C15.5685 11.6667 15.7142 11.7271 15.8217 11.8346C15.9291 11.942 15.9896 12.0877 15.9897 12.2397V18.1772ZM5.0531 18.0344C5.0531 18.0962 5.03477 18.1566 5.00043 18.208C4.96609 18.2594 4.91729 18.2994 4.86018 18.3231C4.80308 18.3467 4.74025 18.3529 4.67963 18.3409C4.61901 18.3288 4.56333 18.299 4.51963 18.2553C4.47592 18.2116 4.44616 18.156 4.4341 18.0953C4.42204 18.0347 4.42823 17.9719 4.45188 17.9148C4.47554 17.8577 4.51559 17.8089 4.56698 17.7745C4.61837 17.7402 4.67879 17.7219 4.7406 17.7219C4.8234 17.7221 4.90273 17.7551 4.96128 17.8137C5.01982 17.8722 5.05283 17.9516 5.0531 18.0344ZM15.5969 18.0344C15.5969 18.0962 15.5786 18.1566 15.5443 18.208C15.5099 18.2594 15.4611 18.2994 15.404 18.3231C15.3469 18.3467 15.2841 18.3529 15.2235 18.3409C15.1628 18.3288 15.1072 18.299 15.0634 18.2553C15.0197 18.2116 14.99 18.156 14.9779 18.0953C14.9659 18.0347 14.9721 17.9719 14.9957 17.9148C15.0194 17.8577 15.0594 17.8089 15.1108 17.7745C15.1622 17.7402 15.2226 17.7219 15.2844 17.7219C15.3672 17.7221 15.4466 17.7551 15.5051 17.8137C15.5636 17.8722 15.5967 17.9516 15.5969 18.0344ZM2.52593 12.5522V13.1772C2.52593 13.1979 2.5177 13.2178 2.50305 13.2324C2.4884 13.2471 2.46853 13.2553 2.44781 13.2553C2.42709 13.2553 2.40722 13.2471 2.39257 13.2324C2.37791 13.2178 2.36968 13.1979 2.36968 13.1772V12.5522C2.36968 12.5315 2.37791 12.5116 2.39257 12.4969C2.40722 12.4823 2.42709 12.4741 2.44781 12.4741C2.46853 12.4741 2.4884 12.4823 2.50305 12.4969C2.5177 12.5116 2.52593 12.5315 2.52593 12.5522ZM2.52593 15.6772V16.3022C2.52593 16.3229 2.5177 16.3428 2.50305 16.3574C2.4884 16.3721 2.46853 16.3803 2.44781 16.3803C2.42709 16.3803 2.40722 16.3721 2.39257 16.3574C2.37791 16.3428 2.36968 16.3229 2.36968 16.3022V15.6772C2.36968 15.6565 2.37791 15.6366 2.39257 15.6219C2.40722 15.6073 2.42709 15.5991 2.44781 15.5991C2.46853 15.5991 2.4884 15.6073 2.50305 15.6219C2.5177 15.6366 2.52593 15.6565 2.52593 15.6772ZM2.52593 14.1147V14.7397C2.52593 14.7604 2.5177 14.7803 2.50305 14.7949C2.4884 14.8096 2.46853 14.8178 2.44781 14.8178C2.42709 14.8178 2.40722 14.8096 2.39257 14.7949C2.37791 14.7803 2.36968 14.7604 2.36968 14.7397V14.1147C2.36968 14.094 2.37791 14.0741 2.39257 14.0594C2.40722 14.0448 2.42709 14.0366 2.44781 14.0366C2.46853 14.0366 2.4884 14.0448 2.50305 14.0594C2.5177 14.0741 2.52593 14.094 2.52593 14.1147ZM2.52593 17.2397V17.8647C2.52593 17.8854 2.5177 17.9053 2.50305 17.9199C2.4884 17.9346 2.46853 17.9428 2.44781 17.9428C2.42709 17.9428 2.40722 17.9346 2.39257 17.9199C2.37791 17.9053 2.36968 17.8854 2.36968 17.8647V17.2397C2.36968 17.219 2.37791 17.1991 2.39257 17.1844C2.40722 17.1698 2.42709 17.1616 2.44781 17.1616C2.46853 17.1616 2.4884 17.1698 2.50305 17.1844C2.5177 17.1991 2.52593 17.219 2.52593 17.2397ZM4.42809 12.3904C4.42809 12.3286 4.44642 12.2682 4.48076 12.2168C4.5151 12.1654 4.5639 12.1254 4.621 12.1017C4.67811 12.0781 4.74094 12.0719 4.80156 12.0839C4.86218 12.096 4.91786 12.1258 4.96156 12.1695C5.00527 12.2132 5.03503 12.2689 5.04709 12.3295C5.05915 12.3901 5.05296 12.4529 5.02931 12.51C5.00565 12.5671 4.9656 12.6159 4.91421 12.6503C4.86282 12.6846 4.8024 12.7029 4.74059 12.7029C4.65779 12.7027 4.57846 12.6697 4.51992 12.6111C4.46137 12.5526 4.42836 12.4732 4.42809 12.3904ZM15.5969 12.3904C15.5969 12.4522 15.5786 12.5127 15.5443 12.5641C15.5099 12.6154 15.4611 12.6555 15.404 12.6792C15.3469 12.7028 15.2841 12.709 15.2235 12.6969C15.1628 12.6849 15.1072 12.6551 15.0634 12.6114C15.0197 12.5677 14.99 12.512 14.9779 12.4514C14.9659 12.3908 14.9721 12.328 14.9957 12.2709C15.0194 12.2137 15.0594 12.1649 15.1108 12.1306C15.1622 12.0963 15.2226 12.0779 15.2844 12.0779C15.3672 12.0782 15.4466 12.1111 15.5052 12.1697C15.5637 12.2283 15.5967 12.3076 15.5969 12.3904ZM15.3656 16.7114V13.7051C15.3656 13.6482 15.35 13.5924 15.3206 13.5437C15.2912 13.495 15.249 13.4552 15.1987 13.4286C14.785 13.2112 14.4471 12.8734 14.2297 12.4597C14.2032 12.4094 14.1634 12.3672 14.1147 12.3378C14.066 12.3084 14.0102 12.2928 13.9532 12.2928H6.04675C5.98983 12.2928 5.93401 12.3084 5.88528 12.3378C5.83656 12.3672 5.79679 12.4094 5.77026 12.4597C5.55285 12.8734 5.21497 13.2112 4.80133 13.4286C4.75098 13.4552 4.70882 13.495 4.6794 13.5437C4.64999 13.5924 4.63442 13.6482 4.6344 13.7051V16.7114C4.63442 16.7683 4.64999 16.8242 4.6794 16.8729C4.70882 16.9216 4.75098 16.9614 4.80133 16.9879C5.21512 17.2053 5.55304 17.5433 5.77026 17.9572C5.79679 18.0075 5.83656 18.0497 5.88528 18.0791C5.93401 18.1085 5.98983 18.1241 6.04675 18.1241H13.9532C14.0102 18.1241 14.066 18.1085 14.1147 18.0791C14.1634 18.0497 14.2032 18.0075 14.2297 17.9572C14.447 17.5433 14.7849 17.2053 15.1987 16.9879C15.249 16.9614 15.2912 16.9216 15.3206 16.8729C15.35 16.8242 15.3656 16.7683 15.3656 16.7114ZM6.75445 15.9537C6.60703 15.9536 6.46292 15.9099 6.34036 15.828C6.2178 15.746 6.12228 15.6296 6.0659 15.4934C6.00951 15.3572 5.99478 15.2073 6.02357 15.0627C6.05236 14.9181 6.12338 14.7853 6.22764 14.6811C6.33191 14.5769 6.46474 14.5059 6.60933 14.4772C6.75393 14.4485 6.9038 14.4632 7.03999 14.5197C7.17618 14.5761 7.29258 14.6717 7.37446 14.7943C7.45634 14.9169 7.50003 15.061 7.5 15.2084C7.49982 15.4061 7.42121 15.5956 7.28142 15.7353C7.14163 15.875 6.9521 15.9536 6.75445 15.9537ZM10 16.8491C9.67551 16.8491 9.35831 16.7528 9.08851 16.5726C8.81871 16.3923 8.60843 16.1361 8.48426 15.8363C8.36008 15.5365 8.32759 15.2066 8.39089 14.8884C8.4542 14.5701 8.61045 14.2778 8.8399 14.0483C9.06934 13.8189 9.36168 13.6626 9.67993 13.5993C9.99818 13.536 10.3281 13.5685 10.6278 13.6927C10.9276 13.8169 11.1839 14.0272 11.3641 14.297C11.5444 14.5668 11.6406 14.8839 11.6406 15.2084C11.6401 15.6434 11.4671 16.0604 11.1595 16.3679C10.8519 16.6755 10.435 16.8485 10 16.8491ZM13.2455 15.9537C13.0981 15.9537 12.954 15.91 12.8314 15.8281C12.7088 15.7462 12.6132 15.6298 12.5568 15.4936C12.5003 15.3574 12.4856 15.2075 12.5143 15.0629C12.5431 14.9183 12.6141 14.7855 12.7183 14.6812C12.8226 14.577 12.9554 14.506 13.1 14.4772C13.2446 14.4484 13.3945 14.4632 13.5307 14.5197C13.6669 14.5761 13.7833 14.6717 13.8652 14.7943C13.9471 14.9169 13.9908 15.061 13.9908 15.2084C13.9905 15.406 13.9119 15.5954 13.7722 15.7351C13.6325 15.8748 13.4431 15.9534 13.2455 15.9537ZM17.6303 15.6772V16.3022C17.6303 16.3229 17.6221 16.3428 17.6074 16.3574C17.5928 16.3721 17.5729 16.3803 17.5522 16.3803C17.5315 16.3803 17.5116 16.3721 17.4969 16.3574C17.4823 16.3428 17.4741 16.3229 17.4741 16.3022V15.6772C17.4741 15.6565 17.4823 15.6366 17.4969 15.6219C17.5116 15.6073 17.5315 15.5991 17.5522 15.5991C17.5729 15.5991 17.5928 15.6073 17.6074 15.6219C17.6221 15.6366 17.6303 15.6565 17.6303 15.6772ZM17.6303 14.1147V14.7397C17.6303 14.7604 17.6221 14.7803 17.6074 14.7949C17.5928 14.8096 17.5729 14.8178 17.5522 14.8178C17.5315 14.8178 17.5116 14.8096 17.4969 14.7949C17.4823 14.7803 17.4741 14.7604 17.4741 14.7397V14.1147C17.4741 14.094 17.4823 14.0741 17.4969 14.0594C17.5116 14.0448 17.5315 14.0366 17.5522 14.0366C17.5729 14.0366 17.5928 14.0448 17.6074 14.0594C17.6221 14.0741 17.6303 14.094 17.6303 14.1147ZM17.6303 17.2397V17.8647C17.6303 17.8854 17.6221 17.9053 17.6074 17.9199C17.5928 17.9346 17.5729 17.9428 17.5522 17.9428C17.5315 17.9428 17.5116 17.9346 17.4969 17.9199C17.4823 17.9053 17.4741 17.8854 17.4741 17.8647V17.2397C17.4741 17.219 17.4823 17.1991 17.4969 17.1844C17.5116 17.1698 17.5315 17.1616 17.5522 17.1616C17.5729 17.1616 17.5928 17.1698 17.6074 17.1844C17.6221 17.1991 17.6303 17.219 17.6303 17.2397ZM17.6303 12.5522V13.1772C17.6303 13.1979 17.6221 13.2178 17.6074 13.2324C17.5928 13.2471 17.5729 13.2553 17.5522 13.2553C17.5315 13.2553 17.5116 13.2471 17.4969 13.2324C17.4823 13.2178 17.4741 13.1979 17.4741 13.1772V12.5522C17.4741 12.5315 17.4823 12.5116 17.4969 12.4969C17.5116 12.4823 17.5315 12.4741 17.5522 12.4741C17.5729 12.4741 17.5928 12.4823 17.6074 12.4969C17.6221 12.5116 17.6303 12.5315 17.6303 12.5522ZM3.65018 8.60348L1.20822 6.67685C1.17256 6.64871 1.14373 6.61285 1.1239 6.57197C1.10407 6.53109 1.09376 6.48625 1.09375 6.44082C1.09374 6.39539 1.10401 6.35054 1.12381 6.30965C1.14361 6.26876 1.17242 6.23288 1.20807 6.20472L3.65005 4.27572C3.69439 4.24071 3.74769 4.21888 3.80385 4.21275C3.86001 4.20662 3.91676 4.21644 3.9676 4.24107C4.01845 4.2657 4.06132 4.30415 4.09133 4.35202C4.12133 4.39989 4.13724 4.45524 4.13724 4.51174V5.64398H4.68099C7.32919 5.64398 7.79157 7.41737 8.33928 9.45534C8.35372 9.50903 8.3671 9.56313 8.37941 9.61763C8.39665 9.69093 8.38652 9.76799 8.35093 9.83434C8.31534 9.90069 8.25674 9.95176 8.18615 9.97794C8.11555 10.0041 8.03783 10.0036 7.96758 9.97652C7.89733 9.94943 7.8394 9.89761 7.80467 9.8308C7.0647 8.37364 6.69643 7.23461 4.68099 7.23461H4.13724V8.36735C4.13724 8.42383 4.12133 8.47917 4.09135 8.52703C4.06136 8.57489 4.0185 8.61334 3.96768 8.63798C3.91686 8.66262 3.86012 8.67245 3.80397 8.66635C3.74782 8.66025 3.69453 8.63846 3.65018 8.60348ZM18.7918 6.67685L16.3498 8.60348C16.3055 8.63846 16.2522 8.66025 16.196 8.66635C16.1399 8.67246 16.0831 8.66263 16.0323 8.63799C15.9815 8.61335 15.9386 8.57489 15.9086 8.52703C15.8787 8.47917 15.8627 8.42383 15.8627 8.36735V7.23461H15.319C13.3036 7.23461 12.9353 8.37364 12.1953 9.8308C12.1606 9.89761 12.1027 9.94943 12.0324 9.97652C11.9622 10.0036 11.8844 10.0041 11.8138 9.97794C11.7432 9.95176 11.6846 9.90069 11.6491 9.83434C11.6135 9.76799 11.6033 9.69093 11.6206 9.61763C11.6329 9.5632 11.6463 9.5091 11.6607 9.45534C12.2084 7.41737 12.6708 5.64398 15.319 5.64398H15.8627V4.51174C15.8627 4.45524 15.8787 4.39989 15.9087 4.35202C15.9387 4.30415 15.9815 4.2657 16.0324 4.24107C16.0832 4.21644 16.14 4.20662 16.1961 4.21275C16.2523 4.21888 16.3056 4.24071 16.3499 4.27572L18.7919 6.20472C18.8276 6.23288 18.8564 6.26876 18.8762 6.30965C18.896 6.35054 18.9063 6.39539 18.9062 6.44082C18.9062 6.48625 18.8959 6.53109 18.8761 6.57197C18.8563 6.61285 18.8274 6.6487 18.7918 6.67685ZM7.84359 3.1711L9.75994 0.741415C9.78855 0.705129 9.82502 0.675802 9.8666 0.655639C9.90818 0.635475 9.95379 0.625 10 0.625C10.0462 0.625 10.0918 0.635475 10.1334 0.655639C10.175 0.675802 10.2115 0.705129 10.2401 0.741415L12.1564 3.1711C12.192 3.21618 12.2141 3.27036 12.2203 3.32744C12.2265 3.38452 12.2165 3.44219 12.1915 3.49386C12.1664 3.54552 12.1273 3.58908 12.0787 3.61956C12.03 3.65005 11.9738 3.66621 11.9163 3.66621H10.7953V4.44483C10.7953 5.52583 10.7197 6.60551 10.5692 7.67597L10.2842 9.70144C10.2746 9.76997 10.2405 9.8327 10.1883 9.87809C10.1361 9.92348 10.0692 9.94848 10 9.94848C9.9308 9.94848 9.86394 9.92348 9.81171 9.87809C9.75948 9.8327 9.72541 9.76997 9.71577 9.70144L9.53934 8.44723C9.31651 6.8633 9.20468 5.26573 9.20468 3.66621H8.08365C8.02623 3.66621 7.96997 3.65005 7.92132 3.61957C7.87266 3.58908 7.83357 3.54552 7.80852 3.49385C7.78347 3.44219 7.77348 3.38452 7.77968 3.32744C7.78588 3.27036 7.80803 3.21618 7.84359 3.1711Z" fill="white"/>
</svg>

            Distribusi Gaji
          </Button>
        </div>
      )
    : (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {!disableTemplateButton && <Button 
            variant="custom" 
            className="w-full sm:w-auto border border-[#007BFF] bg-[white] text-[#007BFF] dark:text-white color-[#007BFF]" 
            size="sm"
            onClick={() => window.open(`${apiUrl || (globalThis as any).API_URL + (globalThis as any).API_PREFIX}/payroll/payroll-periode/export-template${templateType ? `?type=${templateType}` : ''}`, '_blank')}
            disabled={approvalStore.isAllButtonsDisabled()}
          >
            <IconDownloadTemplate size={16} color="#007BFF" />
            Template Import Data
          </Button>}

          {!disableImportButton && <Button
            variant="outline"
            size="sm"
            className="bg-success text-white dark:text-white w-full sm:w-auto"
            onClick={() => setShowUpload(true)}
            disabled={disableImportButton || approvalStore.isImportDisabled()}
          >
            <IconImport size={16} /> Import
          </Button>}

          <Button
            variant="custom"
            className="w-full sm:w-auto bg-[#007BFF] text-white dark:text-white"
            size="sm"
            disabled={!hasSelection || disableFinalizeButton || approvalStore.isFinalizeDisabled()}
            onClick={() => setShowApprovalModal(true)}
          >
            Finalisasi Data
          </Button>
        </div>
      );

  // Dokumentasi: render DataTable dan modal delete
  return (
    <>
      <DataTable
        title={title}
        data={rows}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={pageSize}
        toolbarRightSlotAtas={toolbarRightSlotAtas}
        appendDefaultToolbarRightAtas={isDistribusiPage}
        onExport={isDistribusiPage ? () => {} : undefined}
        resetKey={resetKey}
        toolbarRightSlot={toolbarRightSlot}

        useExternalPagination={useExternalPagination}
        externalPage={externalPage}
        externalTotal={externalTotal}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onPageChangeExternal={onPageChangeExternal}
        onRowsPerPageChangeExternal={onRowsPerPageChangeExternal}
        onColumnFilterChange={onColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={onDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
      />
      <DeleteDataGajiModal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setRowToDelete(null); }}
        data={rowToDelete ? { idKaryawan: (rowToDelete as BaseRow).idKaryawan, pengguna: (rowToDelete as any)?.pengguna } : null}
        handleDelete={handleDeleteConfirm}
        submitting={isDeleting}
      />
      <UploadExcelModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onImport={async (file) => {
          const success = await processUpload(file, templateType);
          if (success) {
            setShowUpload(false);
            // Optionally refresh data or show success message
          }
        }}
      />
      <PayrollApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={handleApprovalConfirm}
        submitting={isApproving}
        statusPersetujuan={selectedRows.length > 0 ? (selectedRows[0] as any).statusPersetujuan : ''}
        periodDate={selectedRows.length > 0 ? (selectedRows[0] as any).tanggalPengajuan : ''}
        isDistributionPage={isDistribusiPage}
      />
    </>
  );
}
