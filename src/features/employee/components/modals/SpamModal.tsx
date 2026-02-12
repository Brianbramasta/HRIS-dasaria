import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useSpamModalStore } from "@/stores/useSpamModalStore";
import { useNavigate } from "react-router";
import { useApiEmployee } from "../../hooks/api/useApiEmployee";

interface ContractData {
  id: string;
  employeeName: string;
  avatar: string;
  contractDuration: string;
  durationColor: "orange" | "red" | "green"; // orange: bulan, red: minggu, green: normal
}

interface SpamModalProps {
  data?: ContractData[];
}

export const SpamModal: React.FC<SpamModalProps> = ({
  data = [],
}) => {
  const { isOpen, openModal, closeModal } = useSpamModalStore();
  const navigate = useNavigate();
  const [selectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [displayData, setDisplayData] = useState<ContractData[]>(data);
  const { employeesNearContractEnd, fetchEmployeesNearContractEnd } = useApiEmployee();

  // Fetch data on component mount
  useEffect(() => {
    console.log('SpamModal mounted, fetching data...');
    fetchEmployeesNearContractEnd();
  }, []); // Empty dependency - hanya fetch sekali saat mount

  // Map API data to ContractData format and show modal if there's data
  useEffect(() => {
    console.log('employeesNearContractEnd changed:', employeesNearContractEnd);
    
    if (employeesNearContractEnd && employeesNearContractEnd.length > 0) {
      const mappedData: ContractData[] = employeesNearContractEnd.map((item, index) => ({
        id: `${item.employee_name}-${index}`,
        employeeName: item.employee_name,
        avatar: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.employee_name}`,
        contractDuration: `${item.remaining_month} Bulan`,
        durationColor: getDurationColor(item.remaining_month),
      }));
      setDisplayData(mappedData);
      console.log('Mapped data:', mappedData);
      // Only open modal if there's data
      if (mappedData.length > 0) {
        console.log('Opening modal with data');
        openModal();
      }
    } else {
      setDisplayData([]);
    }
  }, [employeesNearContractEnd]);



  const getDurationBgColor = (color: "orange" | "red" | "green") => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-700";
      case "red":
        return "bg-red-100 text-red-700";
      case "green":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDurationColor = (remainingMonth: number): "orange" | "red" | "green" => {
    if (remainingMonth <= 1) {
      return "red"; // Less than or equal to 1 month = red
    } else if (remainingMonth <= 3) {
      return "orange"; // 2-3 months = orange
    }
    return "green"; // More than 3 months = green
  };

  const handleProcess = () => {
    console.log("Processing selected employees:", Array.from(selectedEmployees));
    navigate("/contract-extension");
    // Handle the process here
    closeModal();
  };

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
                        <img
                          src={item.avatar}
                          alt={item.employeeName}
                          className="h-10 w-10 rounded-full"
                        />
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
            onClick={handleProcess}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Proses Perpanjangan
          </button>
        </div>
      </div>
    </Modal>
  );
};
