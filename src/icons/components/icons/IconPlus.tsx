export const IconPlus = ({ size = 16, color = 'white' }: { size?: number, color?: string }) => (
  <>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="10" stroke={color} stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 3"/>
      <path d="M11.9987 7.33301V16.6663M7.33203 11.9997H16.6654" stroke={color} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </>
)
