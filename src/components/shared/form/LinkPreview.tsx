import Button from '@/components/ui/button/Button';
import { formatUrlFile } from '@/utils/formatUrlFile';

interface LinkPreviewProps {
  url?: string | undefined;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function LinkPreview({ url, label = 'Lihat Sertifikat', disabled = false, className = '' }: LinkPreviewProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`w-full ${className}`}
      onClick={() => window.open(formatUrlFile(url || ''), '_blank')}
      disabled={disabled || !url}
      endIcon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_312_23811)">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.3333 0.666992H10L9.33333 1.33366L11.4107 3.41099L6.07733 8.74433L7.256 9.92299L12.5893 4.58966L14.6667 6.66699L15.3333 6.00033V0.666992ZM0.5 2.50033H7V4.16699H2.16667V13.8337H11.8333V9.00033H13.5V15.5003H0.5V2.50033Z" fill="#007BFF"/>
          </g>
          <defs>
            <clipPath id="clip0_312_23811">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      }
    >
      {label}
    </Button>
  );
}