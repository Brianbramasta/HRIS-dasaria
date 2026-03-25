import React, { useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useSpamModalStore } from "@/stores/useSpamModalStore";
import { useNavigate, useLocation } from "react-router";
import { formatImage } from "@/utils/formatImage";
import { useAuthStore } from "@/features/auth/stores/AuthStore";

interface SpamModalProps {
  // data?: ContractData[]; // No longer needed as it's in the store
}

export const SpamModal: React.FC<SpamModalProps> = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { 
    isOpen, 
    closeModal, 
    displayData, 
    fetchEmployeesNearContractEnd, 
    getDurationBgColor, 
    isEmployeePage, 
    handleProcess,
    resetModalState
  } = useSpamModalStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [prevPathname, setPrevPathname] = React.useState(location.pathname);

  // Don't render modal if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Fetch data only when accessing employee pages and reset state on page change
  useEffect(() => {
    // Reset state if page has changed
    if (prevPathname !== location.pathname) {
      resetModalState();
      setPrevPathname(location.pathname);
    }
    
    if (isEmployeePage(location.pathname)) {
      //console.log('On employee page, checking for contract end data...');
      fetchEmployeesNearContractEnd();
    } else {
      // Close modal and reset state if not on employee page
      if (isOpen) {
        closeModal();
      }
      resetModalState();
    }
  }, [location.pathname, prevPathname, isOpen, closeModal, fetchEmployeesNearContractEnd, isEmployeePage, resetModalState]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton={true}
      className="md:max-w-lg"
    >
      <div className="p-6 md:p-8" style={{ 'zoom': '90%' }}>
        {/* Header */}
        <div className="mb-4 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2.16602V6.49935H10.8333C8.42833 6.49935 6.5 8.42768 6.5 10.8327V41.166C6.5 42.3153 6.95655 43.4175 7.7692 44.2301C8.58186 45.0428 9.68406 45.4994 10.8333 45.4994H41.1667C43.5717 45.4994 45.5 43.571 45.5 41.166V10.8327C45.5 9.68341 45.0435 8.58121 44.2308 7.76855C43.4181 6.9559 42.3159 6.49935 41.1667 6.49935H39V2.16602H34.6667V6.49935H17.3333V2.16602H13ZM10.8333 17.3327H41.1667V41.166H10.8333V17.3327ZM23.8333 19.4993V30.3327H28.1667V19.4993H23.8333ZM23.8333 34.666V38.9994H28.1667V34.666H23.8333Z" fill="#FD7E14" />
              </svg>

            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Pembaruan Masa Kontrak Karyawan
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Terdapat beberapa karyawan yang kontraknya akan habis
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#004969] text-white z-10">
                <tr className="bg-[#004969] text-white">

                  <th className="px-4 py-3 text-center font-semibold">Karyawan</th>
                  <th className="px-4 py-3 text-center font-semibold">Sisa Kontrak</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >

                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          {formatImage(item.avatar, item.employeeName)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {item.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block rounded-full px-4 py-2 text-sm font-medium status-styling ${getDurationBgColor(
                          item.durationColor
                        )}`}
                      >
                        {item.contractDuration}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Ingatkan Nanti
          </button>
          <button
            onClick={() => handleProcess(navigate)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Proses Perpanjangan
          </button>
        </div>
      </div>
    </Modal>
  );
};
