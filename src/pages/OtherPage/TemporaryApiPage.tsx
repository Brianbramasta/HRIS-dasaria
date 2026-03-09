import React from 'react';
import InputField from '@/components/shared/field/InputField';
import useTemporaryApiStore from '@/stores/useTemporaryApiStore';
import { addNotification } from '@/stores/notificationStore';

const TemporaryApiPage: React.FC = () => {
  const { apiUrl, apiPrefix, setApiUrl, setApiPrefix, resetAll } = useTemporaryApiStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiPrefix(e.target.value);
  };

  const handleReset = () => {
    resetAll();
    addNotification({
      title: 'Reset Berhasil',
      description: 'Konfigurasi API telah direset ke nilai default.',
      variant: 'success',
    });
  };

  const handleApply = () => {
    addNotification({
      title: 'Berhasil',
      description: 'URL API telah diperbaharui.',
      variant: 'success',
    });
    
    // Gunakan window.location.href agar halaman melakukan reload total
    // dan ApiService menginisialisasi ulang baseURL dari localStorage
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h1 className="text-2xl font-bold text-gray-900">Konfigurasi API URL Sementara</h1>
      {/* <p className="text-gray-600 text-sm">
        Gunakan halaman ini untuk mengubah URL API secara dinamis. Perubahan akan disimpan di local storage dan akan digunakan oleh ApiService.
      </p> */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}>
      <div className="mt-6">
        <InputField
          label="Inputkan URL API di sini"
          placeholder="https://api.example.com"
          value={apiUrl}
          onChange={handleChange}
          containerClassName="mb-4"
        />
        <InputField
          label="Inputkan Prefix API di sini"
          placeholder="/api"
          value={apiPrefix}
          onChange={handlePrefixChange}
          containerClassName="mb-4"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>URL Saat Ini:</strong> {apiUrl || 'Menggunakan Default (VITE_API_URL)'}
        </p>
        <p className="text-xs text-blue-700 mt-1">
          <strong>Prefix Saat Ini:</strong> {apiPrefix || 'Menggunakan Default (/api)'}
        </p>
        <p className="text-xs text-blue-700 mt-1">
          <strong>URL Lengkap:</strong> {apiUrl && apiPrefix ? `${apiUrl}${apiPrefix}` : 'Menggunakan Default (VITE_API_URL)'}
        </p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button 
          type='submit'
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
        >
          Terapkan Perubahan & Ke Dashboard
        </button>
        <button 
          type='button'
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Reset ke Default
        </button>
      </div>
      </form>
    </div>
  );
};

export default TemporaryApiPage;
