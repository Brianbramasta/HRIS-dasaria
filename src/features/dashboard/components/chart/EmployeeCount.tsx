import { useMemo, useState } from "react";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { Calendar, ChevronLeft, ChevronRight } from "react-feather";
import BarChartTwo from "@/components/charts/bar/BarChartTwo";
import SelectField from "@/components/shared/field/SelectField";

export default function EmployeeCount() {
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Jumlah Karyawan
        </h4>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <SelectField
            containerClassName="w-40"
            options={directorateOptions}
            placeholder="Direktorat"
            onChange={setDirectorate}
            defaultValue={directorate}
          />
          <SelectField
            containerClassName="w-36"
            options={divisionOptions}
            placeholder="Divisi"
            onChange={setDivision}
            defaultValue={division}
          />
          <SelectField
            containerClassName="w-40"
            options={departmentOptions}
            placeholder="Departemen"
            onChange={setDepartment}
            defaultValue={department}
          />
          <SelectField
            containerClassName="w-36"
            options={unitOptions}
            placeholder="Unit"
            onChange={setUnit}
            defaultValue={unit}
          />

          <div className="relative">
            <Button
              onClick={() => setIsYearOpen((v) => !v)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 dropdown-toggle"
            >
              Pilih Tahun
              <Calendar size={16} />
            </Button>
            <Dropdown isOpen={isYearOpen} onClose={() => setIsYearOpen(false)}>
              <div className="p-3 w-64">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setYearRangeStart((s) => s - 12)}
                    className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-semibold text-sm">
                    {yearRangeStart} - {yearRangeStart + 11}
                  </span>
                  <button
                    onClick={() => setYearRangeStart((s) => s + 12)}
                    className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const y = yearRangeStart + i;
                    return (
                      <button
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setIsYearOpen(false);
                        }}
                        className={`px-2 py-1 text-sm rounded ${
                          year === y
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <BarChartTwo
          series={series}
          categories={categories}
          colors={colors}
          height={320}
        />
      </div>
    </div>
  );
}
