/**
 * Utility function to format filter array values into a string with custom delimiter
 * @param filterArray - Array of filter values
 * @param delimiter - Custom delimiter to join the array (default: '~!@')
 * @returns Formatted string or empty string if array is empty/null
 */
export const formatFilterValue = (
  filterArray: string[] | null | undefined,
  delimiter: string = '~!@'
): string => {
  if (!filterArray || filterArray.length === 0) {
    return '';
  }
  
  return filterArray.join(delimiter);
};

/**
 * Utility function to get and format filter value from store using resetKey
 * @param getStore - Function to access store state
 * @param fallbackKey - Fallback key if resetKey is not available
 * @param delimiter - Custom delimiter to join the array (default: '~!@')
 * @returns Formatted string or empty string if array is empty/null
 */
export const getFormattedFilterFromStore = (
  getStore: (selector: (state: any) => any) => any,
  fallbackKey: string = '',
  delimiter: string = '~!@'
): string => {
  const storeState = getStore((s: any) => s);
  const resetKey = storeState.resetKey;
  const filterArray = storeState.filters[resetKey] || storeState.filters[fallbackKey];
  
  return formatFilterValue(filterArray, delimiter);
};
