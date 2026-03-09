import { useState, useMemo, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiJobTitles } from '../../hooks/api/useApiJobTitles';
import { useApiDirectorates } from '../../hooks/api/useApiDirectorates';
import { useApiDivisions } from '../../hooks/api/useApiDivisions';
import { useApiDepartments } from '../../hooks/api/useApiDepartments';
import { employeeMasterDataService } from '../../../employee/services/EmployeeMasterData.service';

interface DropdownOption {
  value: string;
  label: string;
}

interface UseAddEmployeePositionModalStoreState {
  positionOptions: DropdownOption[];
  structuralJobOptions: DropdownOption[];
  directorateOptions: DropdownOption[];
  divisionOptions: DropdownOption[];
  departmentOptions: DropdownOption[];
  unitOptions: DropdownOption[];
  loading: boolean;
  error: string | null;
  searchPositions: (query: string) => void;
  searchDirectorates: (query: string) => void;
  searchDivisions: (query: string) => void;
  searchDepartments: (query: string) => void;
  fetchStructuralJobs: (jabatanId: string) => void;
  fetchUnits: (departmentId: string) => void;
  clearDropdowns: () => void;
}

export const useAddEmployeePositionModalStore = (): UseAddEmployeePositionModalStoreState => {
  const [positionQuery, setPositionQuery] = useState('');
  const [directorateQuery, setDirectorateQuery] = useState('');
  const [divisionQuery, setDivisionQuery] = useState('');
  const [departmentQuery, setDepartmentQuery] = useState('');
  const [selectedJabatan, setSelectedJabatan] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const searchPositionsTimeout = useRef<any>(null);
  const searchDirectoratesTimeout = useRef<any>(null);
  const searchDivisionsTimeout = useRef<any>(null);
  const searchDepartmentsTimeout = useRef<any>(null);

  const { getDropdown: getPositionDropdown } = useApiJobTitles();
  const { getDropdown: getDirectorateDropdown } = useApiDirectorates();
  const { getDropdown: getDivisionDropdown } = useApiDivisions();
  const { getDropdown: getDepartmentDropdown } = useApiDepartments();

  // Query for positions
  const {
    data: positionsData,
    isLoading: positionsLoading,
    error: positionsError,
  } = useQuery({
    queryKey: ['positions-dropdown', positionQuery],
    queryFn: async () => {
      const items = await getPositionDropdown(positionQuery);
      return (items || []).map((p: any) => ({ value: p.id, label: p.job_title_name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query for directorates
  const {
    data: directoratesData,
    isLoading: directoratesLoading,
    error: directoratesError,
  } = useQuery({
    queryKey: ['directorates-dropdown', directorateQuery],
    queryFn: async () => {
      const items = await getDirectorateDropdown(directorateQuery);
      return (items || []).map((d: any) => ({ value: d.id, label: d.directorate_name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query for divisions
  const {
    data: divisionsData,
    isLoading: divisionsLoading,
    error: divisionsError,
  } = useQuery({
    queryKey: ['divisions-dropdown', divisionQuery],
    queryFn: async () => {
      const items = await getDivisionDropdown(divisionQuery);
      return (items || []).map((d: any) => ({ value: d.id, label: d.division_name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query for departments
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ['departments-dropdown', departmentQuery],
    queryFn: async () => {
      const items = await getDepartmentDropdown(departmentQuery);
      return (items || []).map((d: any) => ({ value: d.id, label: d.department_name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query for structural jobs (based on selected jabatan)
  const {
    data: structuralJobsData,
    isLoading: structuralJobsLoading,
    error: structuralJobsError,
  } = useQuery({
    queryKey: ['structural-jobs-dropdown', selectedJabatan],
    queryFn: async () => {
      if (!selectedJabatan) return [];
      const data = await employeeMasterDataService.getStructuralJobDropdown(selectedJabatan);
      return (data || []).map((j: any) => ({ value: j.id, label: j.name }));
    },
    enabled: !!selectedJabatan,
    staleTime: 5 * 60 * 1000,
  });

  // Query for units (based on selected department)
  const {
    data: unitsData,
    isLoading: unitsLoading,
    error: unitsError,
  } = useQuery({
    queryKey: ['units-dropdown', selectedDepartment],
    queryFn: async () => {
      if (!selectedDepartment) return [];
      const data = await employeeMasterDataService.getUnitDropdownByDepartmentId(selectedDepartment, '');
      return (data || []).map((u: any) => ({ value: u.id, label: u.name ?? u.name }));
    },
    enabled: !!selectedDepartment,
    staleTime: 5 * 60 * 1000,
  });

  const searchPositions = useCallback((query: string) => {
    if (searchPositionsTimeout.current) clearTimeout(searchPositionsTimeout.current);
    searchPositionsTimeout.current = setTimeout(() => {
      setPositionQuery(query);
    }, 500);
  }, []);

  const searchDirectorates = useCallback((query: string) => {
    if (searchDirectoratesTimeout.current) clearTimeout(searchDirectoratesTimeout.current);
    searchDirectoratesTimeout.current = setTimeout(() => {
      setDirectorateQuery(query);
    }, 500);
  }, []);

  const searchDivisions = useCallback((query: string) => {
    if (searchDivisionsTimeout.current) clearTimeout(searchDivisionsTimeout.current);
    searchDivisionsTimeout.current = setTimeout(() => {
      setDivisionQuery(query);
    }, 500);
  }, []);

  const searchDepartments = useCallback((query: string) => {
    if (searchDepartmentsTimeout.current) clearTimeout(searchDepartmentsTimeout.current);
    searchDepartmentsTimeout.current = setTimeout(() => {
      setDepartmentQuery(query);
    }, 500);
  }, []);

  const fetchStructuralJobs = useCallback((jabatanId: string) => {
    setSelectedJabatan(jabatanId);
  }, []);

  const fetchUnits = useCallback((departmentId: string) => {
    setSelectedDepartment(departmentId);
  }, []);

  const clearDropdowns = useCallback(() => {
    setPositionQuery('');
    setDirectorateQuery('');
    setDivisionQuery('');
    setDepartmentQuery('');
    setSelectedJabatan('');
    setSelectedDepartment('');
  }, []);

  const isLoading = positionsLoading || directoratesLoading || divisionsLoading || departmentsLoading || structuralJobsLoading || unitsLoading;
  const error = positionsError || directoratesError || divisionsError || departmentsError || structuralJobsError || unitsError;

  const state: UseAddEmployeePositionModalStoreState = useMemo(
    () => ({
      positionOptions: positionsData || [],
      structuralJobOptions: structuralJobsData || [],
      directorateOptions: directoratesData || [],
      divisionOptions: divisionsData || [],
      departmentOptions: departmentsData || [],
      unitOptions: unitsData || [],
      loading: isLoading,
      error: error ? (error instanceof Error ? error.message : 'Gagal memuat data dropdown') : null,
      searchPositions,
      searchDirectorates,
      searchDivisions,
      searchDepartments,
      fetchStructuralJobs,
      fetchUnits,
      clearDropdowns,
    }),
    [
      positionsData,
      structuralJobsData,
      directoratesData,
      divisionsData,
      departmentsData,
      unitsData,
      isLoading,
      error,
      searchPositions,
      searchDirectorates,
      searchDivisions,
      searchDepartments,
      fetchStructuralJobs,
      fetchUnits,
      clearDropdowns,
    ]
  );

  return state;
};
