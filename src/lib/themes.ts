
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210 90% 65%), hsl(190 80% 85%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(220 25% 50%), hsl(210 30% 20%))',
  },
  {
    name: 'Sky',
    className: 'theme-sky',
    gradient: 'linear-gradient(to right, hsl(190 100% 40%), hsl(210 80% 70%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340 80% 65%), hsl(355 90% 85%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150 80% 40%), hsl(175 70% 70%))',
  },
   {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(50 100% 60%), hsl(25 95% 50%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(220 90% 40%), hsl(200 70% 25%))',
  },
  {
    name: 'Candy',
    className: 'theme-candy',
    gradient: 'linear-gradient(to right, hsl(330 100% 65%), hsl(180 90% 50%))',
  },
  {
    name: 'Sage',
    className: 'theme-sage',
    gradient: 'linear-gradient(to right, hsl(90 45% 60%), hsl(110 35% 40%))',
  },
];
