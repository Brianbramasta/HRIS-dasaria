import { useEmployeeCount } from "../../hooks/chart/useEmployeeCount";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { Calendar, ChevronLeft, ChevronRight } from "react-feather";
import BarChartTwo from "@/components/charts/bar/BarChartTwo";
import SelectField from "@/components/shared/field/SelectField";

export default function EmployeeCount() {
  const {
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
  } = useEmployeeCount();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
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
                    onClick={() => setYearRangeStart((s: number) => s - 12)}
                    className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-semibold text-sm">
                    {yearRangeStart} - {yearRangeStart + 11}
                  </span>
                  <button
                    onClick={() => setYearRangeStart((s: number) => s + 12)}
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
