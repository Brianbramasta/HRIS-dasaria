export function useContractModalConfig() {
  const optionsJenisKontrak = [
    { value: 'PKWT', label: 'PKWT' },
    { value: 'PKWTT', label: 'PKWTT' },
  ];
  return { optionsJenisKontrak };
}

export default useContractModalConfig;
