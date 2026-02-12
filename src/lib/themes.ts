
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210, 90%, 55%), hsl(190, 80%, 45%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(220, 15%, 40%), hsl(210, 20%, 70%))',
  },
  {
    name: 'Sky',
    className: 'theme-sky',
    gradient: 'linear-gradient(to right, hsl(190, 90%, 50%), hsl(210, 70%, 70%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 80%, 60%), hsl(355, 70%, 50%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 70%, 50%), hsl(175, 60%, 35%))',
  },
   {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(50, 95%, 60%), hsl(25, 85%, 50%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(220, 80%, 40%), hsl(200, 60%, 25%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(30, 90%, 55%), hsl(350, 80%, 50%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 60%, 30%), hsl(100, 35%, 50%))',
  },
  {
    name: 'Royal',
    className: 'theme-royal',
    gradient: 'linear-gradient(to right, hsl(270, 70%, 50%), hsl(240, 50%, 35%))',
  },
  {
    name: 'Candy',
    className: 'theme-candy',
    gradient: 'linear-gradient(to right, hsl(330, 90%, 65%), hsl(180, 80%, 50%))',
  },
    {
    name: 'Sage',
    className: 'theme-sage',
    gradient: 'linear-gradient(to right, hsl(90, 35%, 60%), hsl(110, 25%, 40%))',
  },
];
