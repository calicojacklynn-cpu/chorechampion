
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function ChoreChampionLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
    >
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent-foreground))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15l-3.09 2.25 1.18-3.8L7 11.41l3.8-.34L12 7.5l1.2 3.57 3.8-.34-3.09 2.04 1.18 3.8L12 15z"
        fill="hsl(var(--background))"
        stroke="hsl(var(--background))"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
