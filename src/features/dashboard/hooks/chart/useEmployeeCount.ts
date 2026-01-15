import { useMemo, useState } from "react";

export function useEmployeeCount() {
  const [directorate, setDirectorate] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [year, setYear] = useState<number>(2026);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(2020);

  const directorateOptions = useMemo(
    () => [
      { value: "ops", label: "Operasional" },
      { value: "tech", label: "Teknologi" },
      { value: "fin", label: "Keuangan" },
    ],
    []
  );

  const divisionOptions = useMemo(
    () => [
      { value: "production", label: "Produksi" },
      { value: "engineering", label: "Engineering" },
      { value: "qa", label: "QA" },
    ],
    []
  );

  const departmentOptions = useMemo(
    () => [
      { value: "hrga", label: "HRGA" },
      { value: "fat", label: "FAT" },
      { value: "osm", label: "OSM" },
    ],
    []
  );

  const unitOptions = useMemo(
    () => [
      { value: "unit-a", label: "Unit A" },
      { value: "unit-b", label: "Unit B" },
      { value: "unit-c", label: "Unit C" },
    ],
    []
  );

  const categories = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agt",
      "Sept",
      "Okt",
      "Nov",
      "Des",
    ],
    []
  );

  const series = useMemo(
    () => [
      { name: "HRGA", data: [12, 10, 8, 11, 9, 10, 12, 9, 5, 8, 10, 11] },
      { name: "FAT", data: [9, 8, 7, 9, 7, 8, 9, 8, 4, 6, 8, 9] },
      { name: "OSM", data: [8, 7, 6, 7, 6, 7, 8, 7, 3, 5, 7, 8] },
      { name: "N&T", data: [7, 6, 5, 6, 5, 6, 7, 6, 2, 4, 6, 7] },
      { name: "W&L", data: [6, 5, 4, 5, 4, 5, 6, 5, 2, 3, 5, 6] },
      { name: "BS", data: [5, 4, 3, 4, 3, 4, 5, 4, 1, 2, 4, 5] },
    ],
    [directorate, division, department, unit, year]
  );

  const colors = [
    "#004b6b",
    "#1a6b8f",
    "#2d86a8",
    "#5aa6c3",
    "#8bc4d8",
    "#b7dbe6",
  ];

  return {
    directorate,
    setDirectorate,
    division,
    setDivision,
    department,
    setDepartment,
    unit,
    setUnit,
    year,
    setYear,
    isYearOpen,
    setIsYearOpen,
    yearRangeStart,
    setYearRangeStart,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    unitOptions,
    categories,
    series,
    colors,
  };
}
