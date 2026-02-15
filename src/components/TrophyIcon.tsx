
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="black"
      strokeWidth="1.5"
      {...props}
      className={cn(props.className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.89,3.22,11.11,3.22a1.3,1.3,0,0,0-1.3,1.3V5.4h4.38V4.52A1.3,1.3,0,0,0,12.89,3.22Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.16,6.72a3.39,3.39,0,0,0-2.43-1H18.2V4.52a2.6,2.6,0,0,0-2.6-2.6H8.38a2.6,2.6,0,0,0-2.6,2.6V5.72H5.27a3.39,3.39,0,0,0-2.43,1,3.42,3.42,0,0,0-.84,2.54v.28c.19,2.4,1.7,4.8,4.38,5.84a.92.92,0,0,0,.62,0,1,1,0,0,0,.56-1V13.11a1.2,1.2,0,0,1,1.19-1.19h5a1.2,1.2,0,0,1,1.19,1.19v1.27a1,1,0,0,0,.56,1,.92.92,0,0,0,.62,0c2.68-1,4.19-3.44,4.38-5.84v-.28A3.42,3.42,0,0,0,19.16,6.72Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12,18.41a1,1,0,0,0-1,1V22h2V19.41A1,1,0,0,0,12,18.41Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14,15.5H10a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Z"
      />
    </svg>
  );
}
