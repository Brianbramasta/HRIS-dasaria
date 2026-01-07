export function useStoryPayrollTab(isEditable: boolean) {
  const title = isEditable ? 'Story Payroll (Edit)' : 'Story Payroll';
  const message = 'Belum ada histori payroll.';
  return { title, message };
}

