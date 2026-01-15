import React from "react";
import { Modal } from "@/components/ui/modal";

interface ContractRenewalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractRenewalDetailModal: React.FC<ContractRenewalDetailModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Data statis untuk detail pembaruan kontrak (sesuai gambar)
  const details = [
    { label: "Jenis Perubahan", value: "Mutasi" },
    { label: "Perusahaan", value: "Dasaria" },
    { label: "Kantor", value: "Head Office" },
    { label: "Direktorat", value: "SDM" },
    { label: "Divisi", value: "HR" },
    { label: "Departemen", value: "HR" },
    { label: "Posisi", value: "HR" },
    { label: "Jabatan", value: "Entry Level" },
    { label: "Golongan", value: "D4" },
    { label: "Jenjang Jabatan", value: "Senior" },
    { label: "Gaji Pokok", value: "Rp. 4.000.000" },
    { label: "Kategori Karyawan", value: "Staf" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl p-0 overflow-hidden"
      maxWidth="2xl"
    >
      <div className="flex flex-col md:flex-row h-full min-h-[600px]">
        {/* Left Side - Document Preview */}
        <div className="w-full md:w-1/3 bg-white p-6 flex flex-col items-center border-r border-gray-200">
            <div className="w-full mb-4">
                <p className="text-[10px] text-gray-500 font-semibold">PT Garuda Lintas Cakrawala</p>
                <p className="text-[10px] text-gray-400">Dokumen Perpanjangan Kontrak (PKWT)</p>
                <div className="w-full border-b border-gray-300 my-2"></div>
            </div>
          
          <div className=" flex items-center justify-center w-full relative">
            {/* Placeholder for Document/Logo */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-100 via-blue-50 to-orange-100 flex items-center justify-center opacity-80">
                <div className="w-32 h-32 border-[12px] border-white rounded-full"></div>
            </div>
          </div>
          
          <div className="mb-auto mt-24  w-48">
            <button className="w-full bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
              Pratinjau Dokumen
            </button>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-full md:w-2/3 p-6 md:p-8 bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Detail Pembaruan Kontrak</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 flex flex-col justify-center"
              >
                <span className="text-sm font-semibold text-gray-900 mb-0.5">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
