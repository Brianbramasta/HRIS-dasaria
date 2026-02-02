import { useState, useEffect } from 'react';
import { employeeMasterDataService } from '../../../services/EmployeeMasterData.service';
import { PTKPDropdownItem } from '../../../types/dto/EmployeeType';

export const usePTKPDropdown = (isOpen?: boolean) => {
  const [ptkpOptions, setPtkpOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPTKPOptions = async (search?: string) => {
    setLoading(true);
    try {
      const data = await employeeMasterDataService.getPTKPDropdown(search);
      const options = data.map((item: PTKPDropdownItem) => ({
        value: item.id,
        label: `${item.code} - ${item.category}`,
      }));
      setPtkpOptions(options);
    } catch (error) {
      console.error('Error fetching PTKP options:', error);
      setPtkpOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPTKPOptions();
    }
  }, [isOpen]);

  return {
    ptkpOptions,
    loading,
    fetchPTKPOptions,
  };
};
