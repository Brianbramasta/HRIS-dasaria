import { useState, useCallback } from 'react';
import { employeeMasterDataService } from '../../services/EmployeeMasterData.service';
import { BankDropdownItem } from '../../types/dto/EmployeeType';

interface UseBankDropdownReturn {
  bankOptions: Array<{ value: string; label: string }>;
  loading: boolean;
  error: string | null;
  fetchBankDropdown: (search?: string) => Promise<void>;
}

export const useBankDropdown = (): UseBankDropdownReturn => {
  const [bankOptions, setBankOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBankDropdown = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeMasterDataService.getBankDropdown(search);
      const options = response.map((bank: BankDropdownItem) => ({
        value: bank.id,
        label: bank.name,
      }));
      setBankOptions(options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bank options');
      console.error('Error fetching bank options:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bankOptions,
    loading,
    error,
    fetchBankDropdown,
  };
};
