export default function useSalaryByDirectorateDonut() {
  const labels = ["IT", "Operation", "HR", "FAT", "Other"];
  const series = [15, 20, 10, 45, 10];
  const colors = ["#9CC7FF", "#4FA3D1", "#1E7AA7", "#0B5C7C", "#CFE0FF"];

  return {
    labels,
    series,
    colors,
  };
}
