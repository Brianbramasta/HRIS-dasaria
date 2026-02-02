import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useSpamModalStore } from "@/stores/useSpamModalStore";

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
  data = [
    {
      id: "1",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey",
      contractDuration: "2 Bulan",
      durationColor: "orange",
    },
    {
      id: "2",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey2",
      contractDuration: "2 Minggu",
      durationColor: "red",
    },
    {
      id: "3",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey3",
      contractDuration: "1 Bulan",
      durationColor: "orange",
    },
    {
      id: "4",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey4",
      contractDuration: "2 Bulan",
      durationColor: "orange",
    },
    {
      id: "5",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey5",
      contractDuration: "2 Bulan",
      durationColor: "orange",
    },    {
      id: "6",
      employeeName: "Lindsey Curtis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey6",
      contractDuration: "2 Bulan",
      durationColor: "orange",
    },
  ],
}) => {
  const { isOpen, closeModal } = useSpamModalStore();
  const [selectedEmployees] = useState<Set<string>>(
    new Set()
  );

  

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

  const handleProcess = () => {
    console.log("Processing selected employees:", Array.from(selectedEmployees));
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
      <div className="p-6 md:p-8" style={{'zoom':'90%'}}>
        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="#FF9500"
                />
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
              <thead className="sticky top-0 bg-blue-900 text-white z-10">
                <tr className="bg-blue-900 text-white">
            
                <th className="px-4 py-3 text-center font-semibold">Karyawan</th>
                <th className="px-4 py-3 text-center font-semibold">Sisa Kontrak</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
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
                      className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${getDurationBgColor(
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
