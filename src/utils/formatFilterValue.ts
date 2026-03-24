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
