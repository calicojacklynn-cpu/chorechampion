
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210, 90%, 65%), hsl(190, 80%, 55%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(220, 25%, 50%), hsl(210, 30%, 80%))',
  },
  {
    name: 'Sky',
    className: 'theme-sky',
    gradient: 'linear-gradient(to right, hsl(190, 100%, 60%), hsl(210, 80%, 80%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 90%, 70%), hsl(355, 80%, 60%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 80%, 60%), hsl(175, 70%, 45%))',
  },
   {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(50, 100%, 70%), hsl(25, 95%, 60%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(220, 90%, 50%), hsl(200, 70%, 35%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(30, 100%, 65%), hsl(350, 90%, 60%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 70%, 40%), hsl(100, 45%, 60%))',
  },
  {
    name: 'Royal',
    className: 'theme-royal',
    gradient: 'linear-gradient(to right, hsl(270, 80%, 60%), hsl(240, 60%, 45%))',
  },
  {
    name: 'Candy',
    className: 'theme-candy',
    gradient: 'linear-gradient(to right, hsl(330, 100%, 75%), hsl(180, 90%, 60%))',
  },
    {
    name: 'Sage',
    className: 'theme-sage',
    gradient: 'linear-gradient(to right, hsl(90, 45%, 70%), hsl(110, 35%, 50%))',
  },
];
