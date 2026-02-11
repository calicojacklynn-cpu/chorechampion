
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210, 80%, 50%), hsl(200, 70%, 60%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(220, 10%, 50%), hsl(220, 15%, 60%))',
  },
  {
    name: 'Sky',
    className: 'theme-sky',
    gradient: 'linear-gradient(to right, hsl(195, 80%, 50%), hsl(205, 85%, 60%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 70%, 55%), hsl(350, 75%, 65%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(160, 60%, 50%), hsl(170, 65%, 60%))',
  },
   {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(45, 90%, 55%), hsl(35, 85%, 60%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(220, 70%, 45%), hsl(210, 80%, 55%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(25, 80%, 55%), hsl(350, 70%, 60%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 40%, 40%), hsl(130, 45%, 50%))',
  },
  {
    name: 'Royal',
    className: 'theme-royal',
    gradient: 'linear-gradient(to right, hsl(260, 60%, 55%), hsl(250, 70%, 65%))',
  },
  {
    name: 'Candy',
    className: 'theme-candy',
    gradient: 'linear-gradient(to right, hsl(330, 80%, 60%), hsl(190, 85%, 65%))',
  },
    {
    name: 'Matrix',
    className: 'theme-matrix',
    gradient: 'linear-gradient(to right, hsl(120, 80%, 40%), hsl(120, 90%, 50%))',
  },
];
