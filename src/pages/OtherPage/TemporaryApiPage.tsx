import React from 'react';
import InputField from '@/components/shared/field/InputField';
import useTemporaryApiStore from '@/stores/useTemporaryApiStore';
import { addNotification } from '@/stores/notificationStore';

const TemporaryApiPage: React.FC = () => {
  const { apiUrl, setApiUrl } = useTemporaryApiStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
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
      <p className="text-gray-600 text-sm">
        Gunakan halaman ini untuk mengubah URL API secara dinamis. Perubahan akan disimpan di local storage dan akan digunakan oleh ApiService.
      </p>
      
      <div className="mt-6">
        <InputField
          label="Inputkan URL API di sini"
          placeholder="https://api.example.com"
          value={apiUrl}
          onChange={handleChange}
          containerClassName="mb-4"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>URL Saat Ini:</strong> {apiUrl || 'Menggunakan Default (VITE_API_URL)'}
        </p>
      </div>
      
      <button 
        onClick={handleApply}
        className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
      >
        Terapkan Perubahan & Ke Dashboard
      </button>
    </div>
  );
};

export default TemporaryApiPage;
