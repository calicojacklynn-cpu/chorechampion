import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function GoldRibbonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      stroke="black"
      strokeWidth="1.5"
      {...props}
      className={cn(props.className)}
    >
      <path d="M16,2A10,10,0,1,0,26,12,10,10,0,0,0,16,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,16,20Z" fill="#FFD700"/>
      <path d="M21,11H18V28a1,1,0,0,0,1.52.85L22,27.1l2.48,1.73A1,1,0,0,0,26,28V11H23l-3,4Z" fill="#3B82F6"/>
      <path d="M11,11H14V28a1,1,0,0,1-1.52.85L10,27.1,7.52,28.85A1,1,0,0,1,6,28V11H9l-3,4Z" fill="#3B82F6"/>
    </svg>
  );
}
